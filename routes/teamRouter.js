
const express = require('express')
const router = express.Router()
const Team = require('../controllers/teamController')

router.get('/', Team.findAll)
router.post('/', Team.create)
router.get('/:teamId', Team.findOne)
router.put('/update/:teamId', Team.update)
router.patch('/addmember/:teamId', Team.addMember)
router.patch('/deletemember/:teamId', Team.removeMember)
router.delete('/:teamId', Team.deleteTeam)
router.patch('/status/:teamId', Team.updateStatus)

module.exports = router