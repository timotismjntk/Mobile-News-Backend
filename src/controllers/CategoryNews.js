const response = require('../helpers/response')
const { Category, News } = require('../models')
const { pagination } = require('../helpers/pagination')
const Sequelize = require('sequelize')
const { Op } = require('sequelize')

module.exports = {
  readAllCategory: async (req, res) => {
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
    let searchValue = ''
    let sortValue = ''
    if (typeof search === 'object') {
      searchValue = Object.values(search)[0]
    } else {
      searchValue = search || ''
    }
    if (typeof sort === 'object') {
      sortValue = Object.values(sort)[0]
    } else {
      sortValue = sort || 'createdAt'
    }
    const { count, rows: results } = await Category.findAndCountAll({
      where: { name: { [Op.like]: `%${searchValue}%` } },
      limit: limit,
      offset: (page - 1) * limit,
      order: [
        [sortValue, 'ASC']
      ]
    })
    const pageInfo = pagination(req.baseUrl, req.query, page, limit, count)
    return response(res, 'List of All Category', { results, pageInfo })
  },
  getCategoryId: async (req, res) => {
    const { id } = req.params
    try {
      const results = await Category.findOne({
        where: { id: id },
        include: {
          model: News,
          attributes: [
            [
              Sequelize.literal(`(
              SELECT COUNT(News.id) WHERE categoryId = ${id} GROUP BY categoryId
            )`),
              'articleCount'
            ]
          ]
        }
      })
      if (results) {
        const { name } = results.dataValues
        return response(res, `Category ${name}`, { results })
      } else {
        return response(res, 'Category not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  createCategory: async (req, res) => {
    const { name } = req.body
    try {
      const check = await Category.findOne({
        where: { [Op.Like]: { name: name } }
      })
      if (check) {
        return response(res, 'Error category already exists ', {}, 400, false)
      } else {
        const data = {
          name
        }
        const results = await Category.create(data)
        return response(res, 'Category News created successfully', { results })
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
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
