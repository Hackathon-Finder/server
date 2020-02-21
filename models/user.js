
const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    organization: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'organizer']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
        validate: {
            validator(email) {
                return User.findOne({
                    email
                })
                .then(user=>{
                    if(user){
                        return false
                    }
                    else {
                        return true
                    }
                })
            },
            message: 'Email already registered'
        }
    },
    hp: {
        type: String,
        required: [true, 'Phone is required']
    },
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
    summary: {
        type: String
    },
    status: {
        type: String,
        enum: ['locked', 'available']
    },
    pict: {
        type: String,
        default: 'https://picsum.photos/500'
    },
    review: [{
        id_user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        rank: {
            type: Number,
            min: 0,
            max: 5
        },
        comment: {
            type: String
        }
    }]
})

const User = model('User', userSchema)

module.exports = User