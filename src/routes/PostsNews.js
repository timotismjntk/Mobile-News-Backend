const route = require('express').Router()
const authMiddleware = require('../middleware/auth')
const PostsNewsController = require('../controllers/PostsNews')
// const uploadAvatar = require('../controllers/uploadAvatar')

// route.get('/', authMiddleware.authUser, PostsNewsController.get)
// route.get('/:id', authMiddleware.authUser, PostsNewsController.getUserById)
route.post('/', authMiddleware.authUser, PostsNewsController.createNews)
route.patch('/:id', authMiddleware.authUser, PostsNewsController.editNews)
// route.patch('/update/picture', authMiddleware.authUser, uploadAvatar.updateAvatar)
// route.delete('/:id', authMiddleware.authUser, PostsNewsController.deleteUser)

module.exports = route
