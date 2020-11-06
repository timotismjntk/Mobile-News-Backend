const route = require('express').Router()
const authController = require('../controllers/auth')

route.get('/login', authController.login)
route.post('/signup', authController.signUp)

module.exports = route
