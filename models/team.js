
const { Schema, model } = require('mongoose')

// Teams:
//   name: string
//   owner: id user
//   max_size: event_size
//   members: [id_user]
//   applicants: [id_user]
//   team_size: team_size(Event).length
//   skillset: []
//   status: string
//   event: id_event

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
    team_size:Number,
    members:[{type: Schema.Types.ObjectId, ref: 'User'}],
    applicants:[{type: Schema.Types.ObjectId, ref: 'User'}],
    skillset: {
        type: Array,
        required: [true, 'Team skillset is required']
    },
    status: {
        required: [true, 'Team status is required'],
        type: String
    },
    eventId:{
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    }
})

const Team = model('Team', teamSchema)

module.exports = Team