
const express = require('express')
const router = express.Router()
const User = require('../controllers/userController')
const authentication = require('../middlewares/authentication')

router.get('/', User.findAllUser)
router.get('/:userId', User.findOne)
router.post('/register', User.register)
router.post('/skill', User.findBySkill)
router.post('/login', User.login)
router.patch('/', authentication, User.update)

module.exports = router