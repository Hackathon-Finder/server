
const { Event, User } = require('../models')
const kue = require('kue')
const sendEmailNotif = require('../helpers/eventMailer')
const queue = kue.createQueue()

class eventController {
    static create(req,res,next){
        let event=null
        const { 
            title,
            summary,
            max_size,
            date,
            pictures
        } = req.body
        Event.create({
            title,
            summary,
            max_size,
            ownerId: req.payload.userId,
            pictures,
            date
        })
        .then(data=>{
            event = data
            return User.find({subscribe: 'subscribe'})
        })
        .then(listUser=>{
            listUser.forEach(element=>{
                const job=queue
                    .create('sendEmail', element)
                    .save(function(err){
                        /* istanbul ignore next */
                        if(err) console.log(err)
                    })
            })
            queue.process('sendEmail', function(job, done){
                sendEmailNotif({
                    email: job.data.email,
                    subject: 'New Colabs Event Available!',
                    eventName: event.title,
                })
                done()
            })
            res.status(201).json(event)
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
    static findByOwner(req,res,next){
        Event.find({ownerId: req.payload.userId}).populate(['teams','ownerId','applicants'])
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(next)
    }
    static findOne(req,res,next){
        Event.findById({_id: req.params.eventId}).populate(['teams','ownerId','applicants'])
        .then(data=>{
            if(data){
                return data
            }else{
                return 'error'
            }
        })
        .then(data=>{
            if(data==='error'){
                next({
                    status: 400,
                    message: "Event not found"
                })
            }else{
                res.status(200).json(data)
            }
        })
        .catch(next)
    }
    static updateEvent(req,res,next){
        const { 
            title,
            summary,
            max_size,
            date,
            pictures
        } = req.body
        Event.findByIdAndUpdate({_id: req.params.eventId}, { 
            title,
            summary,
            max_size,
            date,
            pictures
        },{ omitUndefined: true, runValidators: true, new: true }).populate(['teams','ownerId','applicants'])
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
                return 'error'
            }
        })
        .then(data=>{
            if(data=='error'){
                next({
                    status: 400,
                    message: 'team already removed from event'
                })
            }else{
                res.status(200).json({
                    message: 'team removed from event',
                    data
                })
            }
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
            }else{
                res.status(200).json({
                    message: 'team removed from applicants',
                    data
                })
            }
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
        Event.findByIdAndUpdate(
            {_id: req.params.eventId}, 
            {status: req.body.status}, 
            { omitUndefined: true, runValidators: true, new: true }).populate(['teams','ownerId','applicants'])
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(next)
    }
}

module.exports = eventController