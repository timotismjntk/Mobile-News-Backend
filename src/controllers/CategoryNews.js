const response = require('../helpers/response')
const { Category } = require('../models')

module.exports = {
  readAllCategory: async (req, res) => {
    const results = await Category.findAll()
    return response(res, 'List of All Category', { results })
  },
  createCategory: async (req, res) => {
    const { name } = req.body
    const data = {
      name
    }
    const results = await Category.create(data)
    return response(res, 'Category News created successfully', { results })
  },
  editCategory: async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    const results = await Category.findByPk(id)
    if (results) {
      if (name) {
        const data = {
          name
        }
        try {
          await results.update(data)
          return response(res, 'Category News updated successfully', { results })
        } catch (err) {
          return response(res, `${err.errors.map(e => e.message)}`, {}, 400, false)
        }
      }
    }
    return response(res, 'Category not found', {}, 404, false)
  },
  deleteCategory: async (req, res) => {
    const { id } = req.params
    const results = await Category.findByPk(id)
    if (results) {
      await results.destroy()
      return response(res, 'Category deleted successfully', {})
    }
    return response(res, 'Category not found', {}, 404, false)
  }
}
