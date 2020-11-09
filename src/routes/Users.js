const route = require('express').Router()
const authMiddleware = require('../middleware/auth')
const userController = require('../controllers/Users')
const uploadAvatar = require('../controllers/uploadAvatar')

route.get('/', authMiddleware.authUser, userController.getUsers)
route.get('/:id', authMiddleware.authUser, userController.getUserById)
route.patch('/:id', authMiddleware.authUser, userController.updateUser)
route.patch('/update/picture', authMiddleware.authUser, uploadAvatar.updateAvatar)
// route.delete('/:id', authMiddleware.authUser, userController.deleteUser)

module.exports = route
