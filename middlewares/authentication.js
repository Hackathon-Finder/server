const { verifyToken } = require('../helpers/jwt')

function authentication(req,res,next){
    try {
        const payload = verifyToken(req.headers.token)
        req.payload = payload
        
        next()
    }
    catch(err){
        next(err)
    }
}

module.exports = authentication