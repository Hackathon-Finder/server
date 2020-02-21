
const { Schema, model } = require('mongoose')

const teamSchema = new Schema({
    name: {
        required: [true, 'Team name is required'],
        type: String 
    },
    ownerId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    max_size: {
        required: [true, 'Maximum team size is required'],
        type: Number
    },
    team_size:{
        type: Number,
        default: 0
    },
    members:[{type: Schema.Types.ObjectId, ref: 'User'}],
    applicants:[{type: Schema.Types.ObjectId, ref: 'User'}],
    skillset: [{
        skill: {
            type: String
        }, 
        level: {
            type: Number,
            min: 1,
            max: 4
        }
    }],
    status: {
        required: [true, 'Team status is required'],
        type: String,
        enum: ['open', 'locked'],
        default: 'open'
    },
    eventId:{
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    }
})

const Team = model('Team', teamSchema)

module.exports = Team