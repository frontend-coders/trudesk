var utils = require('../helpers/utils')
var path = require('path')
var AnsiUp = require('ansi_up')
var ansiUp = new AnsiUp.default()
var Tail = require('tail').Tail
var fs = require('fs-extra')

var logFile = path.join(__dirname, '../../logs/error.log')

var events = {}

function register (socket) {
  events.onLogsFetch(socket)
}

function eventLoop () {}
events.onLogsFetch = function (socket) {
  socket.on('logs:fetch', function () {
    fs.exists(logFile, function (exists) {
      if (exists) {
        var contents = fs.readFileSync(logFile, 'utf8')
        utils.sendToSelf(socket, 'logs:data', ansiUp.ansi_to_html(contents))

        var tail = new Tail(logFile)

        tail.on('line', function (data) {
          utils.sendToSelf(socket, 'logs:data', ansiUp.ansi_to_html(data))
        })
      } else {
        utils.sendToSelf(socket, 'logs:data', '\r\nInvalid Log File...\r\n')
      }
    })
  })
}

module.exports = {
  events: events,
  eventLoop: eventLoop,
  register: register
}
