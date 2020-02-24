
const express = require('express')
const router = express.Router()
const Event = require('../controllers/eventController')
const authentication = require('../middlewares/authentication')
const {eventAuthorizaton} = require('../middlewares/authorization')
const upload = require('../middlewares/aws-upload')

router.use('/', authentication)

router.post('/', upload.single('pictures'), Event.create)
router.get('/', Event.findAll)
router.get('/search/:eventId', authentication, Event.findOne)
router.get('/owner', authentication, Event.findByOwner)

router.patch('/update/:eventId', eventAuthorizaton, upload.single('pictures'), Event.updateEvent)
router.patch('/updatestatus/:eventId', eventAuthorizaton, Event.updateEventStatus)
router.patch('/addteam/:eventId', eventAuthorizaton, Event.addTeam)
router.patch('/removeteam/:eventId', eventAuthorizaton, Event.removeTeam)
router.patch('/addapplicants/:eventId', eventAuthorizaton, Event.addApplicants)
router.patch('/removeapplicants/:eventId', eventAuthorizaton, Event.removeApplicants)
router.delete('/delete/:eventId', eventAuthorizaton, Event.deleteEvent)

module.exports = router