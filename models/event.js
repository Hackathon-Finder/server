
const { Schema, model } = require('mongoose')

const eventSchema = new Schema({

})

const Event = model('Event', eventSchema)

module.exports = Event