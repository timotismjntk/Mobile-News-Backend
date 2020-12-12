const route = require('express').Router()
const authMiddleware = require('../middleware/auth')
const CommentsController = require('../controllers/Comments')

route.get('/:id', authMiddleware.authUser, CommentsController.getAllComments)
route.post('/', authMiddleware.authUser, CommentsController.postComment)

module.exports = route
