

var _ = require('lodash')

function sortByKeys (obj) {
  var keys = Object.keys(obj)
  var sortedKeys = _.sortBy(keys)
  return _.fromPairs(
    _.map(sortedKeys, function (key) {
      return [key, obj[key]]
    })
  )
}

module.exports = {
  utils: {
    sortByKeys: sortByKeys
  },
  shared: {
    sockets: [],
    usersOnline: {},
    idleUsers: {}
  }
}
