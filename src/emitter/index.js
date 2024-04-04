
'use strict'

const eventEmitter = new (require('events').EventEmitter)()

eventEmitter.all = function (events, callback) {
  const eventList = events.slice(0)

  function onEvent (event) {
    eventEmitter.on(events[event], function () {
      eventList.splice(eventList.indexOf(events[event]), 1)

      if (eventList.length === 0) {
        callback()
      }
    })
  }

  for (const ev in events) {
    if (Object.hasOwn(events, ev)) {
      onEvent(ev)
    }
  }
}

eventEmitter.any = function (events, callback) {
  function onEvent (event) {
    eventEmitter.on(events[event], function () {
      if (events !== null) {
        callback()
      }

      events = null
    })
  }

  for (var ev in events) {
    if (events.hasOwnProperty(ev)) {
      onEvent(ev)
    }
  }
}

module.exports = eventEmitter
