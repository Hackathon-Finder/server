
const { Event } = require('../models')

class eventController {
    static create(req,res,next){
        //harusnya dapet owner id dari req.payload
        const { 
            title,
            summary,
            team_size,
            date,
            pictures
        } = req.body
        Event.create({
            title,
            summary,
            team_size,
            ownerId: req.payload.userId,
            pictures,
            date
        })
        .then(data=>{
            res.status(201).json(data)
        })
        .catch(next)
    }
    static findAll(req,res,next){
        Event.find().populate(['teams','ownerId','applicants'])
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(next)
    }
    static findOne(req,res,next){
        Event.findById({_id: req.params.eventId}).populate(['teams','ownerId','applicants'])
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(next)
    }
    static updateEvent(req,res,next){
        Event.findByIdAndUpdate({_id: req.params.eventId}, req.body,{new: true}).populate(['teams','ownerId','applicants'])
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(next)
    }
    static addTeam(req,res,next){
        Event.findById({_id: req.params.eventId})
        .then(data=>{
            if(data.teams.includes(req.body.teamId)){
                return 'error'
            }
            return Event.findByIdAndUpdate({_id: req.params.eventId},{
                $addToSet: { teams: req.body.teamId },
                $pull: { applicants: req.body.teamId }
            }, {new : true}).populate(['teams','ownerId','applicants'])
        })
        .then(data=>{
            if(data === 'error'){
                next({
                    status: 400,
                    message: 'Team already added'
                })
            }
            else {
                res.status(200).json({
                    message: 'team added to event',
                    data
                })
            }
        })
        .catch(next)
    }
    static removeTeam(req,res,next){
        Event.findById({_id: req.params.eventId})
        .then(data=>{
            if(data.teams.includes(req.body.teamId)){
                return Event.findByIdAndUpdate({_id: req.params.eventId},{
                    $addToSet: { applicants: req.body.teamId },
                    $pull: { teams: req.body.teamId }
                },{ new:true}).populate(['teams','ownerId','applicants'])
            }else{
                next({
                    status: 400,
                    message: 'Team already removed'
                })
            }
        })
        .then(data=>{
            res.status(200).json({
                message: 'team removed from event',
                data
            })
        })
        .catch(next)
    }
    static addApplicants(req,res,next){
        Event.findById({_id: req.params.eventId})
        .then(data=>{
            if(data.applicants.includes(req.body.teamId)){
                return 'error'
            }else{
                return Event.findByIdAndUpdate({_id: req.params.eventId},{
                    $addToSet: { applicants: req.body.teamId },
                },{ new:true}).populate(['teams','ownerId','applicants'])
            }
        })
        .then(data=>{
            if(data === 'error'){
                next({
                    status: 400,
                    message: 'Team already added to applicants'
                })    
            }
            else{
                res.status(200).json({
                    message: 'team added to applicants',
                    data
                })
            }
            
        })
        .catch(next)
    }
    static removeApplicants(req,res,next){
        Event.findById({_id: req.params.eventId})
        .then(data=>{
            if(data.applicants.includes(req.body.teamId)){
                return Event.findByIdAndUpdate({_id: req.params.eventId},{
                    $pull: { applicants: req.body.teamId },
                },{ new:true}).populate(['teams','ownerId','applicants'])
            }else{
                return 'error'
            }
        })
        .then(data=>{
            if(data==='error'){
                next({
                    status: 400,
                    message: 'Team already removed from applicants'
                })
            }
            res.status(200).json({
                message: 'team remove from applicants',
                data
            })
        })
        .catch(next)
    }
    static deleteEvent(req,res,next){
        Event.findByIdAndDelete({_id: req.params.eventId})
        .then(()=>{
            res.status(200).json({
                message: 'Event successfuly deleted'
            })
        })
        .catch(next)
    }
    static updateEventStatus(req,res,next){
        Event.findByIdAndUpdate({_id: req.params.eventId}, {status: req.body.status}, {new: true}).populate(['teams','ownerId','applicants'])
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(next)
    }
}

module.exports = eventController