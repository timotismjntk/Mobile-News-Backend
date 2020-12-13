const route = require('express').Router()
const authController = require('../controllers/Auth')
const authMiddleware = require('../middleware/auth')

route.post('/login', authController.login)
route.post('/signup', authController.signUp)
route.post('/verify/token', authMiddleware.checkExpiredToken)

module.exports = route
