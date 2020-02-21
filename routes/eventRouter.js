
const express = require('express')
const router = express.Router()
const Event = require('../controllers/eventController')

router.post('/', Event.create)
router.get('/', Event.findAll)
router.get('/:eventId', Event.findOne)
router.put('/update/:eventId', Event.updateEvent)
router.patch('/addteam/:eventId', Event.addTeam)
router.patch('/removeteam/:eventId', Event.removeTeam)
router.patch('/addapplicants/:eventId', Event.addApplicants)
router.patch('/removeapplicants/:eventId', Event.removeApplicants)
router.delete('/delete/:eventId', Event.deleteEvent)

module.exports = router