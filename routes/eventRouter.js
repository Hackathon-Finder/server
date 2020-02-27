
const express = require('express')
const router = express.Router()
const Event = require('../controllers/eventController')
const authentication = require('../middlewares/authentication')
const {eventAuthorizaton} = require('../middlewares/authorization')
const upload = require('../middlewares/aws-upload')

router.use('/', authentication)

router.post('/', upload.single('pictures'), Event.create)
router.get('/', Event.findAll)
router.get('/owner', authentication, Event.findByOwner)
router.get('/:eventId', authentication, Event.findOne)

router.patch('/update/:eventId', eventAuthorizaton, upload.single('pictures'), Event.updateEvent)
router.patch('/updatestatus/:eventId', eventAuthorizaton, Event.updateEventStatus)
router.patch('/addteam/:eventId', Event.addTeam)
router.patch('/removeteam/:eventId', Event.removeTeam)
router.patch('/addapplicants/:eventId', Event.addApplicants)
router.patch('/removeapplicants/:eventId', Event.removeApplicants)
router.delete('/delete/:eventId', eventAuthorizaton, Event.deleteEvent)

module.exports = router