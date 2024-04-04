

// var _               = require('lodash');
var mongoose = require('mongoose')
require('moment-duration-format')
var utils = require('../helpers/utils')
const _ = require('lodash')

var COLLECTION = 'statuses'

var statusSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    htmlColor: { type: String, default: '#29b955' },
    uid: { type: Number, unique: true, index: true },
    order: { type: Number, index: true },
    slatimer: { type: Boolean, default: true },
    isResolved: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false }
  },
  {
    toJSON: {
      virtuals: true
    }
  }
)

statusSchema.pre('save', function (next) {
  this.name = utils.sanitizeFieldPlainText(this.name.trim())

  if (!_.isUndefined(this.uid) || this.uid) {
    return next()
  }

  const c = require('./counters')

  const self = this
  c.increment('status', function (err, res) {
    if (err) return next(err)

    self.uid = res.value.next

    if (_.isUndefined(self.uid)) {
      const error = new Error('Invalid UID.')
      return next(error)
    }

    return next()
  })
})

statusSchema.statics.getStatus = function (callback) {
  return this.model(COLLECTION)
    .find({})
    .sort({ order: 1 })
    .exec(callback)
}

statusSchema.statics.getStatusById = function (_id, callback) {
  return this.model(COLLECTION)
    .findOne({ _id: _id })
    .exec(callback)
}

statusSchema.statics.getStatusByUID = function (uid, callback) {
  return this.model(COLLECTION)
    .findOne({ uid: uid })
    .exec(callback)
}

module.exports = mongoose.model(COLLECTION, statusSchema)
