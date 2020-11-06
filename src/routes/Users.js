const route = require('express').Router()
const userController = require('../controllers/Users')

route.get('/', userController.getUsers)
route.get('/:id', userController.getUserById)
route.post('/', userController.CreateUser)
route.patch('/:id', userController.updateUser)
route.delete('/:id', userController.deleteUser)

module.exports = route
