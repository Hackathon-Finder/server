
const express = require('express')
const router = express.Router()
const User = require('./userRouter')
const Team = require('./teamRouter')
const Event = require('./eventRouter')

router.use('/users', User)
router.use('/teams', Team)
router.use('/events', Event)

module.exports = router