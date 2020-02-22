
const { Schema, model } = require('mongoose')
const { hashPassword } = require('../helpers/bcrypt')

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
        required: [true, 'Password is required'],
        minlength: [6, 'Minimum password length 6'],
        select: false
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
        default: ''
    },
    skillset: [{
        skill: {
            type: String
        },
        level: {
            type: Number,
            min: [1, 'Invalid skillset level value'],
            max: [4, 'Invalid skillset level value']
        }
    }],
    summary: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: {
            values: ['locked', 'available'],
            message: 'Invalid status value'
        },
        default: 'available'
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
            min: [0, 'Invalid review rank value'],
            max: [5, 'Invalid review rank value']
        },
        comment: {
            type: String
        }
    }]
})

userSchema.pre("save", function(next){
    let hashedPass = hashPassword(this.password)
    this.password = hashedPass
    next()
})

const User = model('User', userSchema)

module.exports = User