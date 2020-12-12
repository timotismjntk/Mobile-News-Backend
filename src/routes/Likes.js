const route = require('express').Router()
const authMiddleware = require('../middleware/auth')
const likeController = require('../controllers/Likes')

route.post('/', authMiddleware.authUser, likeController.sendLikes)

module.exports = route
