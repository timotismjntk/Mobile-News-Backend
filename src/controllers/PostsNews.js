const response = require('../helpers/response')
const { Post } = require('../models')
const multer = require('multer')
const multerHelper = require('../helpers/multerHelperMultiple')

module.exports = {
  createNews: (req, res) => {
    const { id } = req.user
    multerHelper(req, res, async function (err) {
      const { title, Content, categoryId } = req.body
      try {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_UNEXPECTED_FILE' && req.files.length === 0) {
            console.log(err.code === 'LIMIT_UNEXPECTED_FILE' && req.files.length > 0)
            return response(res, 'fieldname doesnt match', {}, 500, false)
          }
          return response(res, err.message, {}, 500, false)
        } else if (err) {
          return response(res, err.message, {}, 401, false)
        }
        let image = ''
        for (let x = 0; x < req.files.length; x++) {
          const picture = `uploads/${req.files[x].filename}`
          image += picture + ', '
          if (x === req.files.length - 1) {
            image = image.slice(0, image.length - 2)
          }
        }
        const data = {
          userId: Number(id),
          title,
          Content,
          categoryId,
          newsimage: image
        }
        try {
          console.log(data)
          const results = await Post.create(data)
          return response(res, 'News created successfully', { results })
        } catch (err) {
          return response(res, `${err.errors.map(e => e.message)}`, {}, 400, false)
        }
      } catch (e) {
        return response(res, e.message, {}, 401, false)
      }
    })
  },
  editNews: async (req, res) => {
    const { id } = req.user
    const { title, Content, categoryId } = req.body
    multerHelper(req, res, async function (err) {
      try {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_UNEXPECTED_FILE' && req.files.length === 0) {
            console.log(err.code === 'LIMIT_UNEXPECTED_FILE' && req.files.length > 0)
            return response(res, 'fieldname doesnt match', {}, 500, false)
          }
          return response(res, err.message, {}, 500, false)
        } else if (err) {
          return response(res, err.message, {}, 401, false)
        }

        if (req.files) {
          let image = ''
          for (let x = 0; x < req.files.length; x++) {
            const picture = `uploads/${req.files[x].filename}`
            image += picture + ', '
            if (x === req.files.length - 1) {
              image = image.slice(0, image.length - 2)
            }
          }
          const data = {
            userId: Number(id),
            title,
            Content,
            categoryId,
            newsimage: image
          }
          try {
            const results = await Post.create(data)
            return response(res, 'News created successfully', { results })
          } catch (err) {
            return response(res, `${err.errors.map(e => e.message)}`, {}, 400, false)
          }
        }
      } catch (e) {
        return response(res, e.message, {}, 401, false)
      }
    })
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
