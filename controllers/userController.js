
const { User } = require('../models')
const { generateToken } = require('../helpers/jwt')
const { checkPassword } = require('../helpers/bcrypt')

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

    static glogin(req,res,next){
        let userData = {
            name: req.payload.name,
            email: req.payload.email,
            pict: req.payload.picture,
            password: process.env.DEFAULT_PASS,
            role: req.body.role
        }
        User.findOne({
            email: userData.email
        })
        .then(user=>{
            if(user){
                return user
            }
            else {
                return User.create(userData)
            }
        })
        .then(result=>{
            let payload = {
                userId: result._id
            }
            let token = generateToken(payload)
            let user = { ...result._doc }
            delete user.password
            res.status(201).json({
                token,
                user
            })
        })
        .catch(err=>{
            next(err)
        })
    }

    static update(req, res, next) {
        let id = req.payload.userId
        const { summary, status, pict, name, hp, skillset, review } = req.body
        User.findByIdAndUpdate(id, {
            summary, status, pict, name, hp, skillset, review
        }, { omitUndefined: true, runValidators: true })
            .then(_ => {
                res.status(200).json({
                    message: 'Update success'
                })
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
            console.log(err);
        })
    }
}

module.exports = userController