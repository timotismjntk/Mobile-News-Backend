const route = require('express').Router()
const authController = require('../controllers/Auth')
const authMiddleware = require('../middleware/auth')

route.post('/login', authController.login)
route.post('/signup', authController.signUp)
route.post('/verify/token', authMiddleware.checkExpiredToken)
route.post('/reset', authController.getResetCode) // send reset code
route.post('/verify/reset', authController.resetPasswordVerifiyResetCode) // verify reset code

module.exports = route
