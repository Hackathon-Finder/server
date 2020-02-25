
const express = require('express')
const router = express.Router()
const Event = require('../controllers/eventController')
const authentication = require('../middlewares/authentication')
const {eventAuthorizaton} = require('../middlewares/authorization')
const upload = require('../middlewares/aws-upload')

router.use('/', authentication)

router.post('/', upload.single('pictures'), Event.create)
router.get('/', Event.findAll)
router.get('/owner', authentication, Event.findByOwner)//owner Id diambil dari token
router.get('/:eventId', authentication, Event.findOne)

router.patch('/update/:eventId', eventAuthorizaton, upload.single('pictures'), Event.updateEvent)
router.patch('/updatestatus/:eventId', eventAuthorizaton, Event.updateEventStatus)
router.patch('/addteam/:eventId', eventAuthorizaton, Event.addTeam)//team id diambil dari req.body
router.patch('/removeteam/:eventId', eventAuthorizaton, Event.removeTeam)//team id diambil dari req.body
router.patch('/addapplicants/:eventId', Event.addApplicants)//team id diambil dari req.body
router.patch('/removeapplicants/:eventId', Event.removeApplicants)//team id diambil dari req.body
router.delete('/delete/:eventId', eventAuthorizaton, Event.deleteEvent)

module.exports = router