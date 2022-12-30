const Router = require('express')
const userController = require('../controllers/UserController.js')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')
const {check} = require('express-validator')
router.post('/registration', check('email', 'bad email').isEmail(), userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/all-users', checkRole('ADMIN'), userController.getAllUser)


module.exports = router