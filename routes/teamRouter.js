
const express = require('express')
const router = express.Router()
const Team = require('../controllers/teamController')
const authentication = require('../middlewares/authentication')
const {teamAuthorization} = require('../middlewares/authorization')

router.use('/', authentication)

router.get('/', Team.findAll)
router.post('/', Team.create)
router.get('/owner', Team.findByOwner)//owner Id diambil dari token
router.get('/:teamId', Team.findOne)
router.get('/applicant/:userId', Team.findInApplicants)
router.get('/member/:userId', Team.findInMembers)

router.patch('/update/:teamId', teamAuthorization, Team.update)
router.patch('/status/:teamId', teamAuthorization, Team.updateStatus)
router.patch('/addmember/:teamId', teamAuthorization, Team.addMember)
router.patch('/removemember/:teamId', teamAuthorization, Team.removeMember)
router.patch('/addapplicant/:teamId', teamAuthorization, Team.addApplicant)
router.patch('/removeapplicant/:teamId', teamAuthorization, Team.removeApplicant)
router.delete('/:teamId', teamAuthorization, Team.deleteTeam)

module.exports = router