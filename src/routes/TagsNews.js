const route = require('express').Router()
const authMiddleware = require('../middleware/auth')
const TagsNewsController = require('../controllers/TagsNews')
// const uploadAvatar = require('../controllers/uploadAvatar')

route.get('/', authMiddleware.authUser, TagsNewsController.readAllTags)
// route.get('/:id', authMiddleware.authUser, TagsNewsController.getUserById)
route.post('/', authMiddleware.authUser, TagsNewsController.createTags)
route.patch('/:id', authMiddleware.authUser, TagsNewsController.editTags)
// route.patch('/update/picture', authMiddleware.authUser, uploadAvatar.updateAvatar)
// route.delete('/:id', authMiddleware.authUser, TagsNewsController.deleteUser)

module.exports = route
