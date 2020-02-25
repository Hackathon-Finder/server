const {Team,Event,User} = require('../models/index')

function teamAuthorization(req,res,next){
    Team.findById({_id: req.params.teamId})
    .then(data=>{
        if(!data){
            next({
                status: 400,
                message: "Team not found"
            })
        }else{
            if(data.ownerId==req.payload.userId){
                next()
            }else{
                next({
                    status: 403,
                    message: 'Not Authorized'
                })
            }
        }
    })
    .catch(next)
}

function eventAuthorizaton(req,res,next){
    Event.findById({_id: req.params.eventId})
    .then(data=>{
        if(!data){
            next({
                status: 400,
                message: "Event not found"
            })
        }else{
            if(data.ownerId==req.payload.userId){
                next()
            }else{
                next({
                    status: 403,
                    message: 'Not Authorized'
                })
            }
        }
    })
    .catch(next)

}

function reviewAuthorization(req,res,next){
    Team.findById(req.body.teamId).populate('eventId')
    .then(data=>{
        if(!data){
            next({
                status: 404,
                message: 'Team not found'
            })
        }
        else { 
            if(data.eventId.status !== 'ended'){
                next({
                    status: 400,
                    message: 'Event not yet ended'
                })
            }
            if(String(data.ownerId) !== String(req.payload.userId)){
                next({
                    status: 403,
                    message: 'Not Authorized'
                })
            }
            else {
                if(data.members.includes(req.params.userId)){
                    next()
                }
                else {
                    next({
                        status: 403,
                        message: 'Not Authorized'
                    })
                }
            }
        }
    })
}

module.exports = {
    eventAuthorizaton,teamAuthorization, reviewAuthorization
}