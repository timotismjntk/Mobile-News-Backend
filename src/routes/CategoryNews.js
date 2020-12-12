const route = require('express').Router()
const authMiddleware = require('../middleware/auth')
const CategoryNewsController = require('../controllers/CategoryNews')
// const uploadAvatar = require('../controllers/uploadAvatar')

route.get('/', authMiddleware.authUser, CategoryNewsController.readAllCategory)
route.get('/:id', CategoryNewsController.getCategoryId)
route.post('/', authMiddleware.authUser, CategoryNewsController.createCategory)
route.patch('/:id', authMiddleware.authUser, CategoryNewsController.editCategory)
// route.patch('/update/picture', authMiddleware.authUser, uploadAvatar.updateAvatar)
// route.delete('/:id', authMiddleware.authUser, CategoryNewsController.deleteUser)

module.exports = route
