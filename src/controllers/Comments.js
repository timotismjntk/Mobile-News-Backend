const response = require('../helpers/response')
const { pagination } = require('../helpers/pagination')
const { Comments, News, Users } = require('../models')
const Sequelize = require('sequelize')
const { Op } = require('sequelize')

module.exports = {
  postComment: async (req, res) => {
    const { id } = req.user
    const { comment, postId } = req.body
    try {
      if (comment && postId) {
        const searchAuthor = await News.findByPk(postId)
        if (searchAuthor) {
          const { userId: author } = searchAuthor.dataValues
          if (id === author) {
            const data = {
              postId,
              comment,
              authorId: id
            }
            await Comments.create(data)
            return response(res, 'Comment create successfully', {})
          } else {
            const data = {
              postId,
              comment,
              readerId: id
            }
            await Comments.create(data)
            return response(res, 'Comment create successfully', {})
          }
        } else {
          return response(res, 'News Not found', {}, 404, false)
        }
      } else {
        return response(res, 'please fill all column', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  getAllComments: async (req, res) => {
    const { id } = req.params
    let { limit, page, search, sort } = req.query
    if (!limit) {
      limit = 5
    } else {
      limit = parseInt(limit)
    }
    if (!page) {
      page = 1
    } else {
      page = parseInt(page)
    }
    try {
      if (id) {
        const result = await News.findOne({
          where: { id: Number(id) }
        })
        if (result) {
          const { userId: author } = result.dataValues
          console.log(author)
          const { count, rows: results } = await Comments.findAndCountAll({
            where: { postId: id },
            include: [{
              model: Users,
              as: 'readerComment',
              attributes: ['id', 'fullname', 'avatar']
            },
            {
              model: Users,
              as: 'authorComment',
              attributes: ['id', 'fullname', 'avatar']
            }
            ],
            limit: limit,
            offset: (page - 1) * limit
          })
          const pageInfo = pagination(req.baseUrl, req.query, page, limit, count)
          if (results) {
            return response(res, `Showing all comment in post ${id}`, { results, pageInfo })
          } else {
            return response(res, 'Comment Not found', {}, 404, false)
          }
        }
      } else {
        return response(res, 'please input postId', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
