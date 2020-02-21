const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

function googleAuth(req,res,next) {
    let id_token = req.params.id_token

    if(!id_token){
        next({
            code: 401,
            message: 'Authentication fail'
        })
    }

    async function verify(){
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        const payload = ticket.getPayload()
        req.payload = payload
    }

    verify()
    .then(success=>{
        next()
    })
    .catch(_=>{
        next({
            code: 401,
            message: 'Authentication fail'
        })
    })
}

module.exports = googleAuth