const route = require('express').Router()
const authController = require('../controllers/Auth')

route.post('/login', authController.login)
route.post('/signup', authController.signUp)

module.exports = route
