
const express = require('express')
const router = express.Router()
const User = require('../controllers/userController')
const authentication = require('../middlewares/authentication')
const {reviewAuthorization} = require('../middlewares/authorization')
const upload = require('../middlewares/aws-upload')

router.get('/', User.findAllUser)
router.get('/:userId', User.findOne)
router.post('/register', User.register)
router.post('/skill', User.findBySkill)
router.post('/login', User.login)
router.get('/login/token', authentication, User.loginToken)
router.post('/invite', authentication, User.invite)
router.patch('/', authentication, upload.single('pict'), User.update)
router.patch('/skillset', authentication, User.updateSkillset)
router.patch('/review/:userId', authentication, reviewAuthorization, User.updateReview)

module.exports = router