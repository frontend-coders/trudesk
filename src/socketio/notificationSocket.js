var _ = require('lodash')
var async = require('async')
var winston = require('../logger')
var utils = require('../helpers/utils')
var socketEvents = require('./socketEventConsts')

var events = {}

function register (socket) {
  events.updateNotifications(socket)
  events.updateAllNotifications(socket)
  events.markNotificationRead(socket)
  events.clearNotifications(socket)
}

function eventLoop () {
  updateNotifications()
}

function updateNotifications () {
  const notificationSchema = require('../models/notification')
  // eslint-disable-next-line no-unused-vars
  for (const [_, socket] of io.of('/').sockets) {
    const notifications = {}
    async.parallel(
      [
        function (done) {
          notificationSchema.getForUserWithLimit(socket.request.user._id, function (err, items) {
            if (err) return done(err)

            notifications.items = items
            return done()
          })
        },
        function (done) {
          notificationSchema.getUnreadCount(socket.request.user._id, function (err, count) {
            if (err) return done(err)

            notifications.count = count

            return done()
          })
        }
      ],
      function (err) {
        if (err) {
          winston.warn(err)
          return true
        }

        utils.sendToSelf(socket, socketEvents.NOTIFICATIONS_UPDATE, notifications)
      }
    )
  }
}

function updateAllNotifications (socket) {
  var notifications = {}
  var notificationSchema = require('../models/notification')
  notificationSchema.findAllForUser(socket.request.user._id, function (err, items) {
    if (err) return false

    notifications.items = items

    utils.sendToSelf(socket, 'updateAllNotifications', notifications)
  })
}

events.updateNotifications = function (socket) {
  socket.on(socketEvents.NOTIFICATIONS_UPDATE, function () {
    updateNotifications(socket)
  })
}

events.updateAllNotifications = function (socket) {
  socket.on('updateAllNotifications', function () {
    updateAllNotifications(socket)
  })
}

events.markNotificationRead = function (socket) {
  socket.on(socketEvents.NOTIFICATIONS_MARK_READ, function (_id) {
    if (_.isUndefined(_id)) return true
    var notificationSchema = require('../models/notification')
    notificationSchema.getNotification(_id, function (err, notification) {
      if (err) return true

      notification.markRead(function () {
        notification.save(function (err) {
          if (err) return true

          updateNotifications(socket)
        })
      })
    })
  })
}

events.clearNotifications = function (socket) {
  socket.on(socketEvents.NOTIFICATIONS_CLEAR, function () {
    var userId = socket.request.user._id
    if (_.isUndefined(userId)) return true
    var notifications = {}
    notifications.items = []
    notifications.count = 0

    var notificationSchema = require('../models/notification')
    notificationSchema.clearNotifications(userId, function (err) {
      if (err) return true

      utils.sendToSelf(socket, socketEvents.UPDATE_NOTIFICATIONS, notifications)
    })
  })
}

module.exports = {
  events: events,
  eventLoop: eventLoop,
  register: register
}
