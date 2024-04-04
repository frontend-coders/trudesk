

var mongoose = require('mongoose')
var _ = require('lodash')

var COLLECTION = 'conversations'

/*
    {
        title: {String} // Group Title
        userMeta: [
                    {
                        userId: {ObjectId},
                        joinedAt: {Date}
                        hasUnread: Boolean,
                        lastRead: {Date}
                        deletedAt: {Date}
                    }
                  ],
        participants: [{Ref Accounts}]
    }
 */

const conversationSchema = mongoose.Schema({
  title: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userMeta: [
    new mongoose.Schema(
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'accounts' },
        joinedAt: { type: Date },
        hasUnread: { type: Boolean },
        lastRead: { type: Date },
        deletedAt: { type: Date }
      },
      { _id: false, timestamps: true }
    )
  ],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'accounts' }]
})

conversationSchema.methods.isGroup = function () {
  return this.participants.length > 2
}

conversationSchema.statics.getConversations = function (userId, callback) {
  if (!_.isArray(userId)) userId = [userId]
  return this.model(COLLECTION)
    .find({ participants: { $size: 2, $all: userId } })
    .sort('-updatedAt')
    .populate({
      path: 'participants',
      select: 'username fullname email title image lastOnline'
    })
    .exec(callback)
}

conversationSchema.statics.getConversation = function (convoId, callback) {
  const self = this
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        const query = self
          .model(COLLECTION)
          .findOne({ _id: convoId })
          .populate('participants', '_id username fullname email title image lastOnline')

        if (typeof callback === 'function') return query.exec(callback)

        const results = await query.exec()

        return resolve(results)
      } catch (e) {
        if (typeof callback === 'function') return callback(e)
        return reject(e)
      }
    })()
  })
}

conversationSchema.statics.getConversationsWithLimit = function (userId, limit, callback) {
  const self = this
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        const l = limit || 1000000
        const query = self
          .model(COLLECTION)
          .find({ participants: userId })
          .sort('-updatedAt')
          .limit(l)
          .populate({
            path: 'participants',
            select: 'username fullname email title image lastOnline'
          })

        if (typeof callback === 'function') return query.exec(callback)

        const results = await query.exec()

        return resolve(results)
      } catch (e) {
        if (typeof callback === 'function') return callback(e)

        return reject(e)
      }
    })()
  })
}

module.exports = mongoose.model(COLLECTION, conversationSchema)
