const winston = require('winston')
const utils = require('../helpers/utils')
const noticeSchema = require('../models/notice')

const socketEventConst = require('../socketio/socketEventConsts')

const events = {}

function register (socket) {
  events.onShowNotice(socket)
  events.onClearNotice(socket)
}

function eventLoop () {}

events.onShowNotice = function (socket) {
  socket.on(socketEventConst.NOTICE_SHOW, function ({ noticeId }) {
    noticeSchema.getNotice(noticeId, function (err, notice) {
      if (err) return true
      notice.activeDate = new Date()
      notice.save(function (err) {
        if (err) {
          winston.warn(err)
          return true
        }

        utils.sendToAllConnectedClients(io, socketEventConst.NOTICE_UI_SHOW, notice)
      })
    })
  })
}

events.onClearNotice = function (socket) {
  socket.on(socketEventConst.NOTICE_CLEAR, function () {
    utils.sendToAllConnectedClients(io, socketEventConst.NOTICE_UI_CLEAR)
  })
}

module.exports = {
  events: events,
  eventLoop: eventLoop,
  register: register
}
