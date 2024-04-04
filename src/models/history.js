

var mongoose = require('mongoose')

var historySchema = mongoose.Schema({
  action: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'accounts' },
  description: { type: String }
})

module.exports = historySchema
