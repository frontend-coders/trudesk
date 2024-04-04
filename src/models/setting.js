

const mongoose = require('mongoose')

const COLLECTION = 'settings'

const settingSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
})

settingSchema.statics.getSettings = function (callback) {
  const q = this.model(COLLECTION)
    .find()
    .select('name value')

  return q.exec(callback)
}

settingSchema.statics.getSettingByName = async function (name, callback) {
  return new Promise((resolve, reject) => {
    ;(async () => {
      const q = this.model(COLLECTION).findOne({ name })

      try {
        const result = await q.exec()
        if (typeof callback === 'function') callback(null, result)

        return resolve(result)
      } catch (e) {
        if (typeof callback === 'function') callback(e)

        return reject(e)
      }
    })()
  })
}

settingSchema.statics.getSettingsByName = async function (names, callback) {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        const q = this.model(COLLECTION).find({ name: names })
        const result = await q.exec()
        if (typeof callback === 'function') callback(null, result)

        return resolve(result)
      } catch (e) {
        if (typeof callback === 'function') callback(e)

        return reject(e)
      }
    })()
  })
}

settingSchema.statics.getSetting = settingSchema.statics.getSettingByName

module.exports = mongoose.model(COLLECTION, settingSchema)
