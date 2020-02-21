
const express = require('express')
const router = express.Router()
const Team = require('../controllers/teamController')
const authentication = require('../middlewares/authentication')
const {teamAuthorization} = require('../middlewares/authorization')

router.use('/', authentication)

router.get('/', Team.findAll)
router.post('/', Team.create)

router.get('/:teamId', teamAuthorization, Team.findOne)
router.put('/update/:teamId', teamAuthorization, Team.update)
router.patch('/status/:teamId', teamAuthorization, Team.updateStatus)
router.patch('/addmember/:teamId', teamAuthorization, Team.addMember)
router.patch('/removemember/:teamId', teamAuthorization, Team.removeMember)
router.delete('/:teamId', teamAuthorization, Team.deleteTeam)

module.exports = router