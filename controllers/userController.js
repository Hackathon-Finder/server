
const { User, Team } = require('../models')
const { generateToken } = require('../helpers/jwt')
const { checkPassword } = require('../helpers/bcrypt')
const sendMail = require('../helpers/inviteMailer')

class userController {
    static register(req, res, next) {
        let { name, role, password, email } = req.body
        User.create({
            name,
            role,
            password,
            email
        })
            .then(registered => {
                let payload = {
                    userId: registered._id
                }
                let token = generateToken(payload)
                let user = { ...registered._doc }
                delete user.password
                res.status(201).json({
                    token,
                    user
                })
            })
            .catch(err => {
                next(err)
            })
    }

    static login(req, res, next) {
        let { email, password } = req.body
        User.findOne({
            email
        }).select('+password')
            .then(result => {
                if (!result) {
                    next({
                        status: 400,
                        message: "Wrong email/password"
                    })
                }
                else {
                    if (checkPassword(password, result.password)) {
                        let payload = {
                            userId: result._id
                        }
                        let token = generateToken(payload)
                        let user = { ...result._doc }
                        delete user.password
                        res.status(200).json({
                            token,
                            user
                        })
                    }
                    else {
                        next({
                            status: 400,
                            message: "Wrong email/password"
                        })
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static loginToken(req,res,next){
        User.findById(req.payload.userId)
        .then(user=>{
            if(!user){
                next({
                    status: 404,
                    message: "User not found"
                })
            }
            else {
                res.status(200).json({user})
            }
        })
        .catch(err=>{
            next(err)
        })
    }

    static update(req, res, next) {
        let id = req.payload.userId
        const { summary, status, pict, name, hp, skillset, subscribe } = req.body
        User.findByIdAndUpdate(id, {
            summary, status, pict, name, hp, skillset, subscribe
        }, { omitUndefined: true, runValidators: true, new: true })
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                next(err)
            })
    }

    static findAllUser(req, res, next) {
        User.find({ role: 'user' })
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                next(err)
            })
    }

    static findOne(req,res,next){
        User.findById(req.params.userId)
        .then(result=>{
            if(!result){
                next({
                    status: 404,
                    message: 'User not found'
                })
            }
            else {
                res.status(200).json(result)
            }
        })
        .catch(err=>{
            next(err)
        })
    }

    static findBySkill(req,res,next){
        let {skillset} = req.body
        let params = []
        for(let obj of skillset){
            params.push({
                skill: obj.skill,
                level: {$gte: obj.level}
            })
        } 
        User.find({
            skillset: {
                $elemMatch: {
                    $or: params
                }
            }
        }, {password: 0})
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(err=>{
            next(err);
        })
    }

    static updateReview(req,res,next){
        User.findByIdAndUpdate(req.params.userId, {
            $addToSet: {
                review: {
                    id_user: req.payload.userId,
                    rank: req.body.rank,
                    comment: req.body.comment
                }
            }
        }, {new: true, runValidators: true}).populate('review.id_user')
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(err=>{  
            next(err)
        })
    }

    static invite(req,res,next){ 
        let teamData
        Team.findById(req.body.teamId)
        .then(team=>{   
            if(!team){
                next({
                    status: 404,
                    message: 'Team not found'
                })
            }
            else {
                if(team.members.includes(req.body.userId) || team.applicants.includes(req.body.userId)){
                    next({
                        status: 400,
                        message: 'User already a member or applied to your team'
                    })
                }
                else{
                    teamData = team
                    return User.findById(req.body.userId)
                }
            }
        })
        .then(user=>{       
            if(!user){
                next({
                    status: 404,
                    message: 'User not found'
                })
            }
            else{
                return sendMail({
                    team: teamData.name,
                    subject: 'Colabs Team Invitation',
                    email: user.email
                })
            }
        })
        .then(result=>{        
            if(result){  
                if(result.hasOwnProperty('errors')){
                    next({
                        status: 500,
                        message: 'Sending email error'
                    })
                }
                if(result.accepted){
                    res.status(200).json({
                        message: 'Invitation email sent'
                    })
                }
            }
            else{
                next()
            }    
        })
        .catch(err=>{
            next(err)
        })
    }
}

module.exports = userController