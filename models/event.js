
const { Schema, model } = require('mongoose')

const eventSchema = new Schema({
    title:{
        required: [true, 'Event title is required'],
        type: String
    },
    summary:{
        required: [true, 'Event summary is required'],
        type: String,
    },
    status:{
        type: String,
        enum: ['start','ongoing','end'],
        required: true,
        default: 'start'
    },
    team_size: {
        type: Number,
        required: [true, 'Team size is required'],
        min: [1, 'Minimum one team member'],
    },
    teams:[{type: Schema.Types.ObjectId, ref: 'Team'}],
    applicants:[{type: Schema.Types.ObjectId, ref: 'Team'}],
    ownerId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Event owner id is required']
    },
    pictures:{
        type: Array,
        required: [true, 'Event picture is required']
    },
    date:{
        type: Array,
        required: [true, 'Event start and end date is required'],
        validate:{
            validator(v){
                if(v.length == 2){
                    return true
                }
                return false
            },
            message: 'Date must consist of start date and end date'
        }
    }
})

const Event = model('Event', eventSchema)

module.exports = Event