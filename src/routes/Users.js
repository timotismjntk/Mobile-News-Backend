const route = require('express').Router()
const authMiddleware = require('../middleware/auth')
const userController = require('../controllers/Users')
const uploadAvatar = require('../controllers/UploadAvatar')

route.get('/all', authMiddleware.authUser, userController.getAllUsers)
route.get('/', authMiddleware.authUser, userController.getProfile)
route.patch('/', authMiddleware.authUser, userController.updateUser)
route.patch('/update/picture', authMiddleware.authUser, uploadAvatar.updateAvatar)
route.patch('/reset/password', userController.resetPassword)
// route.delete('/:id', authMiddleware.authUser, userController.deleteUser)

module.exports = route
