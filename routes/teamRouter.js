
const express = require('express')
const router = express.Router()
const Team = require('../controllers/teamController')

router.get('/', Team.findAll)
router.post('/', Team.create)
router.get('/:teamId', Team.findOne)
router.put('/update/:teamId', Team.update)
router.patch('/status/:teamId', Team.updateStatus)
router.patch('/addmember/:teamId', Team.addMember)
router.patch('/removemember/:teamId', Team.removeMember)
router.delete('/:teamId', Team.deleteTeam)

module.exports = router