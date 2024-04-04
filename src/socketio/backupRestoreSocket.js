const utils = require('../helpers/utils')
const sharedVars = require('./index').shared
const socketEvents = require('./socketEventConsts')

const events = {}

function register (socket) {
  events.showRestoreOverlay(socket)
  events.emitRestoreComplete(socket)
}

events.showRestoreOverlay = function (socket) {
  socket.on(socketEvents.BACKUP_RESTORE_SHOW_OVERLAY, function () {
    if (global.socketServer && global.socketServer.eventLoop) {
      global.socketServer.eventLoop.stop()
    }

    utils.sendToAllConnectedClients(io, socketEvents.BACKUP_RESTORE_UI_SHOW_OVERLAY)
  })
}

events.emitRestoreComplete = function (socket) {
  socket.on(socketEvents.BACKUP_RESTORE_COMPLETE, function () {
    utils.sendToAllConnectedClients(io, socketEvents.BACKUP_RESTORE_UI_COMPLETE)
    utils.disconnectAllClients(io)
    sharedVars.sockets = []
    sharedVars.usersOnline = {}
    sharedVars.idleUsers = {}
  })
}

module.exports = {
  events: events,
  register: register
}
