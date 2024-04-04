

var mongoose = require('mongoose')

var noteSchema = mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'accounts' },
  date: { type: Date, required: true },
  note: { type: String, required: true },
  deleted: { type: Boolean, default: false, required: true }
})

module.exports = noteSchema
