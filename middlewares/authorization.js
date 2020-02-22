const {Team,Event} = require('../models/index')

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

module.exports = {
    eventAuthorizaton,teamAuthorization
}