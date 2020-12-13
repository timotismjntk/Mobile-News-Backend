const response = require('../helpers/response')
const { Likes } = require('../models')
const { Op } = require('sequelize')

module.exports = {
  sendLikes: async (req, res) => {
    const { id } = req.user
    const { postId } = req.body
    try {
      if (id && postId) {
        const data = {
          postId,
          newsLiker: id
        }
        const check = await Likes.findOne({
          where: {
            [Op.and]: [
              {
                postId: postId
              },
              {
                newsLiker: id
              }
            ]
          }
        })
        if (check) {
          await check.destroy()
          return response(res, 'Like removed', {}, 200, true)
        } else {
          await Likes.create(data)
          return response(res, 'Send liked successfully', {})
        }
      } else {
        return response(res, 'please fill all column', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
