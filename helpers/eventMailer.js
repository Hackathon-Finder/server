const nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ACC,
        pass: process.env.GMAIL_PASS
    }
})

function sendEmailNotif(payload){
    var mailOptions = {
        from: process.env.GMAIL_ACC,
        to: payload.email,
        subject: payload.subject,
        html: `<h4>New Event is available for you: ${payload.eventName}</h4>
        <p>Click Here eventId: ${payload.eventId} to join or create team</p>`
    }
    return transporter.sendMail(mailOptions)
}

module.exports = sendEmailNotif