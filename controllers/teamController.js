
const { Team } = require('../models')

class teamController {
    static create(req,res,next){
        const {name,max_size,skillset,eventId} = req.body
        Team.create({
            name,
            ownerId: req.payload.userId,
            max_size,
            skillset,
            eventId
        }).then(data=>{
            res.status(201).json(data)
        }).catch(next)
    }
    static findAll(req,res,next){
        Team.find().populate(['ownerId','members','applicants','eventId'])
        .then(data=>{
            if(data.length>0){
                res.status(200).json(data)
            }else{
                res.status(200).json({
                    message: "No team in this event"
                })
            }
        }).catch(next)
    }
    static findOne(req,res,next){
        Team.findById({_id: req.params.teamId}).populate(['ownerId','members','applicants','eventId'])
        .then(data=>{
            if(data){
                res.status(200).json(data)
            }else{
                res.status(200).json({
                    message: "Team does not exist"
                })
            }
        }).catch(next)
    }
    static update(req,res,next){
        Team.findByIdAndUpdate({
            _id: req.params.teamId
        },req.body,{ new: true }).populate(['ownerId','members','applicants','eventId'])
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(err=>{
            next(err)
        })
    }
    static addMember(req,res,next){
        Team.findById({_id: req.params.teamId})
        .then(team=>{
            if(team.members.includes(req.body.userId)){
                return 'error'
            }else{
                return Team.findByIdAndUpdate({_id: req.params.teamId},{
                    $addToSet: { members: req.body.userId },
                    $pull: {applicants: req.body.userId}
                }, { new: true }).populate(['ownerId','members','applicants','eventId'])
            }
        })
        .then(data=>{
            if(data==='error'){
                next({
                    status: 400,
                    message: 'Team already added to members'
                })
            }else{
                res.status(200).json(data)
            }
        })
        .catch(next)
    }
    static removeMember(req,res,next){
        Team.findById({_id: req.params.teamId})
        .then(team=>{
            if(team.members.includes(req.body.userId)){
                return Team.findByIdAndUpdate({_id: req.params.teamId},{
                    $addToSet: { applicants: req.body.userId },
                    $pull: { members: req.body.userId },
                }, { new: true }).populate(['ownerId','members','applicants','eventId'])
            }else{
                return 'error'
            }
        }).then(data=>{
            if(data==='error'){
                next({
                    status: 400,
                    message: 'Team already removed from members'
                })
            }else{
                res.status(200).json(data)
            }
        }).catch(next)
    }
    static deleteTeam(req,res,next){
        Team.findByIdAndDelete({_id: req.params.teamId})
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(next)
    }
    static updateStatus(req,res,next){
        Team.findByIdAndUpdate({_id: req.params.teamId}, {status: req.body.status}, { new: true }).populate(['ownerId','members','applicants','eventId'])
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(next)
    }
}

module.exports = teamController