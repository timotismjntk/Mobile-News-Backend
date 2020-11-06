const route = require('express').Router()
const authMiddleware = require('../middleware/auth')
const userController = require('../controllers/Users')
const uploadAvatar = require('../controllers/uploadAvatar')

route.get('/', userController.getUsers)
route.get('/:id', userController.getUserById)
route.patch('/:id', userController.updateUser)
route.patch('/update/picture', authMiddleware.authUser, uploadAvatar.updateAvatar)
route.delete('/:id', userController.deleteUser)

module.exports = route
