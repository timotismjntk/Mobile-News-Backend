/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const response = require('../helpers/response')
const { pagination } = require('../helpers/pagination')
const { Op } = require('sequelize')
const { News, Users, Category, Tags, Likes, Comments } = require('../models')
const multer = require('multer')
const Sequelize = require('sequelize')
const multerHelper = require('../helpers/multerHelper')

module.exports = {
  readAllNews: async (req, res) => {
    let { limit, page, search, sort } = req.query
    const { id: userId } = req.user
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
      // searchKey = Object.keys(search)[0]
      searchValue = Object.values(search)[0]
    } else {
      // searchKey = 'name'
      searchValue = search || ''
    }
    if (typeof sort === 'object') {
      sortValue = Object.values(sort)[0]
    } else {
      sortValue = sort || 'createdAt'
    }
    try {
      const { count, rows: results } = await News.findAndCountAll({
        include: [{
          model: Users,
          as: 'Authors',
          attributes: {
            exclude: ['password', 'birthdate', 'email', 'phone', 'gender', 'role_id', 'createdAt', 'updatedAt']
          }
        },
        {
          model: Category,
          as: 'Category',
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        {
          model: Tags,
          attributes: {
            exclude: ['postId', 'createdAt', 'updatedAt']
          }
        },
        {
          model: Likes,
          attributes: {
            include: [
              [
                Sequelize.literal(`(
                SELECT IF(Likes.newsLiker = ${userId}, true, false) from Likes
              )`),
                'isLiked'
              ]
            ]
          }
        },
        {
          model: Comments
        }
        ],
        attributes: {
          include: [
            [
              Sequelize.literal(`(
              IF(LENGTH(content) > 28, CONCAT(SUBSTRING(content, 1, 200), "..."), content) 
            )`),
              'content'
            ],
            [
              Sequelize.literal(`(
              IF(LENGTH(title) > 28, CONCAT(SUBSTRING(title, 1, 70), "..."), title) 
            )`),
              'title'
            ],
            [
              Sequelize.literal(`
                ((LENGTH(content) - LENGTH(REPLACE(content, ' ', '')))/200)`),
              'readEstimated'
            ]
          ],
          exclude: ['content', 'title']
        },
        where: { title: { [Op.like]: `%${searchValue}%` } },
        limit: limit,
        offset: (page - 1) * limit,
        order: [
          sortValue === 'tags' ? [{ model: Tags }, 'id', 'DESC'] : [sortValue, 'DESC']
        ]
      })
      const pageInfo = pagination(req.baseUrl, req.query, page, limit, count)
      return response(res, 'List of All News', { results, pageInfo })
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  readNewsDetail: async (req, res) => {
    const { id } = req.params
    const { id: userId } = req.user
    const results = await News.findOne({
      where: { id: id },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(id) FROM Likes WHERE postId = ${id} GROUP BY postId
          )`),
            'likesCount'
          ],
          [
            Sequelize.literal(`(
              SELECT newsLiker from Likes WHERE newsLiker = ${userId} AND postId = ${id}
          )`),
            'isLiked'
          ],
          [
            Sequelize.literal(`
              ((LENGTH(content) - LENGTH(REPLACE(content, ' ', '')))/200)`),
            'readEstimated'
          ]
        ]
      },
      include: [{
        model: Users,
        as: 'Authors',
        attributes: {
          exclude: ['password', 'birthdate', 'email', 'phone', 'gender', 'role_id', 'createdAt', 'updatedAt']
        }
      },
      {
        model: Likes
      },
      {
        model: Category,
        as: 'Category',
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      },
      {
        model: Tags,
        attributes: {
          exclude: ['postId', 'createdAt', 'updatedAt']
        }
      }
      ]
    })
    if (results) {
      const { readCount } = results.dataValues
      results.update({ readCount: readCount + 1 })
      return response(res, `News detail ${id}`, { results })
    } else {
      return response(res, 'News Not found', {}, 404, false)
    }
  },
  myNews: async (req, res) => {
    const { id } = req.user
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
      // searchKey = Object.keys(search)[0]
      searchValue = Object.values(search)[0]
    } else {
      // searchKey = 'name'
      searchValue = search || ''
    }
    if (typeof sort === 'object') {
      sortValue = Object.values(sort)[0]
    } else {
      sortValue = sort || 'createdAt'
    }
    try {
      const { count, rows: results } = await News.findAndCountAll({
        include: [{
          model: Users,
          as: 'Authors',
          attributes: {
            exclude: ['password', 'birthdate', 'email', 'phone', 'gender', 'role_id', 'createdAt', 'updatedAt']
          }
        },
        {
          model: Category,
          as: 'Category',
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        {
          model: Tags,
          attributes: {
            exclude: ['postId', 'createdAt', 'updatedAt']
          }
        },
        {
          model: Likes,
          attributes: [
            [
              Sequelize.literal(`(
                SELECT COUNT(id) FROM Likes
            )`),
              'likesCount'
            ]
          ],
          group: ['postId'],
          limit: 1
        }
        ],
        attributes: {
          include: [
            [
              Sequelize.literal(`(
              IF(LENGTH(content) > 28, CONCAT(SUBSTRING(content, 1, 200), "..."), content) 
            )`),
              'content'
            ],
            [
              Sequelize.literal(`(
              IF(LENGTH(title) > 28, CONCAT(SUBSTRING(title, 1, 70), "..."), title) 
            )`),
              'title'
            ],
            [
              Sequelize.literal(`
                ((LENGTH(content) - LENGTH(REPLACE(content, ' ', '')))/200)`),
              'readEstimated'
            ]
          ],
          exclude: ['content', 'title']
        },
        where: {
          [Op.and]: [{
            title: { [Op.like]: `%${searchValue}%` }
          }, {
            userId: id
          }]
        },
        limit: limit,
        offset: (page - 1) * limit,
        order: [
          [sortValue, 'DESC']
        ]
      })
      const pageInfo = pagination(req.baseUrl, req.query, page, limit, count)
      return response(res, 'List of All My News', { results, pageInfo })
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  newsByOtherUser: async (req, res) => {
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
    let searchValue = ''
    let sortValue = ''
    if (typeof search === 'object') {
      // searchKey = Object.keys(search)[0]
      searchValue = Object.values(search)[0]
    } else {
      // searchKey = 'name'
      searchValue = search || ''
    }
    if (typeof sort === 'object') {
      sortValue = Object.values(sort)[0]
    } else {
      sortValue = sort || 'createdAt'
    }
    try {
      const { count, rows: results } = await News.findAndCountAll({
        include: [{
          model: Users,
          as: 'Authors',
          attributes: {
            exclude: ['password', 'birthdate', 'email', 'phone', 'gender', 'role_id', 'createdAt', 'updatedAt']
          }
        },
        {
          model: Category,
          as: 'Category',
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        {
          model: Tags,
          attributes: {
            exclude: ['postId', 'createdAt', 'updatedAt']
          }
        },
        {
          model: Likes,
          attributes: [
            [
              Sequelize.literal(`(
                SELECT COUNT(id) FROM Likes
            )`),
              'likesCount'
            ]
          ],
          group: ['postId'],
          limit: 1
        }
        ],
        attributes: {
          include: [
            [
              Sequelize.literal(`(
              IF(LENGTH(content) > 28, CONCAT(SUBSTRING(content, 1, 200), "..."), content) 
            )`),
              'content'
            ],
            [
              Sequelize.literal(`(
              IF(LENGTH(title) > 28, CONCAT(SUBSTRING(title, 1, 70), "..."), title) 
            )`),
              'title'
            ],
            [
              Sequelize.literal(`
                ((LENGTH(content) - LENGTH(REPLACE(content, ' ', '')))/200)`),
              'readEstimated'
            ]
          ],
          exclude: ['content', 'title']
        },
        where: {
          [Op.and]: [{
            title: { [Op.like]: `%${searchValue}%` }
          }, {
            userId: id
          }]
        },
        limit: limit,
        offset: (page - 1) * limit,
        order: [
          [sortValue, 'DESC']
        ]
      })
      const pageInfo = pagination(req.baseUrl, req.query, page, limit, count)
      return response(res, `List of News by user ${id}`, { results, pageInfo })
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  createNews: (req, res) => {
    const { id } = req.user
    multerHelper(req, res, async function (err) {
      const { title, content, tags } = req.body // name, postId is from
      try {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_UNEXPECTED_FILE' && req.file.length === 0) {
            console.log(err.code === 'LIMIT_UNEXPECTED_FILE' && req.file.length > 0)
            return response(res, 'fieldname doesnt match', {}, 500, false)
          }
          return response(res, err.message, {}, 500, false)
        } else if (err) {
          return response(res, err.message, {}, 401, false)
        }
        if (req.file) {
          const picture = `uploads/${req.file.filename}`
          const data = {
            userId: Number(id),
            title,
            content,
            newsimage: picture
          }
          const results = await News.create({
            ...data
          })

          if (typeof tags !== 'string') {
            tags.forEach(async (el) => {
              await Tags.create({
                name: el,
                postId: results.id
              })
            })
            console.log(tags)
            return response(res, 'News created successfully', { })
          } else {
            await Tags.create({
              name: tags,
              postId: results.id
            })
            console.log(tags)
            return response(res, 'News created successfully', { })
          }
        } else {
          const data = {
            userId: Number(id),
            title,
            content
          }
          const results = await News.create({
            ...data
          })

          if (typeof tags !== 'string') {
            tags.forEach(async (el) => {
              await Tags.create({
                name: el,
                postId: results.id
              })
            })
            console.log(tags)
            return response(res, 'News created successfully', { })
          } else {
            await Tags.create({
              name: tags,
              postId: results.id
            })
            console.log(tags)
            return response(res, 'News created successfully', { })
          }
        }
      } catch (e) {
        return response(res, e.message, {}, 401, false)
      }
    })
  },
  editNews: (req, res) => {
    const { id } = req.user
    multerHelper(req, res, async (err) => {
      const { newsid } = req.params
      let { title, content, categoryId } = req.body
      try {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_UNEXPECTED_FILE' && req.files.length === 0) {
            // console.log(err.code === 'LIMIT_UNEXPECTED_FILE' && req.files.length > 0)
            return response(res, 'fieldname doesnt match', {}, 500, false)
          }
          return response(res, err.message, {}, 500, false)
        } else if (err) {
          return response(res, err.message, {}, 401, false)
        }
        const search = await News.findByPk(newsid)
        if (search) {
          console.log(newsid)
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
              content,
              categoryId,
              newsimage: image
            }
            try {
              const results = await search.update(data)
              return response(res, 'Edit News successfully', { results })
            } catch (err) {
              return response(res, `${err.errors.map(e => e.message)}`, {}, 400, false)
            }
          } else if (title || content || categoryId) {
            categoryId = Number(categoryId)
            const data = {
              userId: Number(id),
              title,
              content,
              categoryId
            }
            try {
              const results = await search.update(data)
              return response(res, 'Edit News successfully', { results })
            } catch (err) {
              return response(res, `${err.message}`, {}, 400, false)
            }
          } else {
            return response(res, 'Atleast fill one column', {}, 401)
          }
        } else {
          return response(res, 'News not found', {}, 404)
        }
      } catch (e) {
        return response(res, e.message, {}, 401, false)
      }
    })
  },
  deleteNews: async (req, res) => {
    const { id } = req.params
    const results = await News.findByPk(id)
    if (results) {
      await results.destroy()
      return response(res, 'News deleted successfully', {})
    }
    return response(res, 'News not found', {}, 404, false)
  }
}
