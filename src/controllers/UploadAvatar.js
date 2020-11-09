const response = require('../helpers/response')
const multer = require('multer')
const multerHelper = require('../helpers/multerHelper')
const { Users } = require('../models')

module.exports = {
  updateAvatar: (req, res) => {
    const { id } = req.user
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

        const picture = `uploads/${req.file.filename}`
        const data = {
          avatar: picture
        }
        const results = await Users.findByPk(id)
        try {
          await results.update(data)
          return response(res, 'Avatar has been Upload successfully', data)
        } catch (err) {
          return response(res, `${err.errors.map(e => e.message)}`, {}, 400, false)
        }
      } catch (e) {
        return response(res, e.message, {}, 401, false)
      }
    })
  }
}
