const response = require('../helpers/response')
const { Post } = require('../models')

module.exports = {
  createNews: async (req, res) => {
    const { id } = req.user
    const { title, Content, categoryId } = req.body
    const data = {
      userId: Number(id),
      title,
      Content,
      categoryId
    }
    console.log(data)
    const results = await Post.create(data)
    return response(res, 'News created successfully', { results })
  },
  editNews: async (req, res) => {
    const { id } = req.params
    const { title, Content, categoryId } = req.body
    const results = await Post.findByPk(id)
    if (results) {
      if (title || Content || categoryId) {
        const data = {
          title,
          Content,
          categoryId
        }
        try {
          await results.update(data)
          return response(res, 'News updated successfully', { results })
        } catch (err) {
          return response(res, `${err.errors.map(e => e.message)}`, {}, 400, false)
        }
      }
    }
    return response(res, 'News not found', {}, 404, false)
  },
  deleteNews: async (req, res) => {
    const { id } = req.params
    const results = await Post.findByPk(id)
    if (results) {
      await results.destroy()
      return response(res, 'News deleted successfully', {})
    }
    return response(res, 'News not found', {}, 404, false)
  }
}
