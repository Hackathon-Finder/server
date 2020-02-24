const nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ACC,
        pass: process.env.GMAIL_PASS
    }
})

function sendEmail(payload){
    var mailOptions = {
        from: process.env.GMAIL_ACC,
        to: payload.email,
        subject: payload.subject,
        html: `<h4>You are invited to join team: ${payload.team}</h4>
        <p>Link to team: </p>`
    }
    return transporter.sendMail(mailOptions)
}

module.exports = sendEmail