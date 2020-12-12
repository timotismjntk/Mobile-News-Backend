const route = require('express').Router()
const authMiddleware = require('../middleware/auth')
const NewsArticleController = require('../controllers/NewsArticle')
// const uploadAvatar = require('../controllers/uploadAvatar')

route.get('/', NewsArticleController.readAllNews)
route.get('/:id', NewsArticleController.readNewsDetail)
route.get('/my/all', authMiddleware.authUser, NewsArticleController.myNews)
route.post('/', authMiddleware.authUser, NewsArticleController.createNews)
route.patch('/:newsid', authMiddleware.authUser, NewsArticleController.editNews)
// route.patch('/update/picture', authMiddleware.authUser, uploadAvatar.updateAvatar)
route.delete('/:id', authMiddleware.authUser, NewsArticleController.deleteNews)

module.exports = route
