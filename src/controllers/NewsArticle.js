/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const response = require('../helpers/response')
const paging = require('../helpers/pagination')
const { Op } = require('sequelize')
const { News, Users, Category, Tags } = require('../models')
const multer = require('multer')
const Sequelize = require('sequelize')
const multerHelper = require('../helpers/multerHelperMultiple')

module.exports = {
  readAllNews: async (req, res) => {
    let { search, orderBy, offset = 0 } = req.query
    const count = await News.count()
    const page = paging(req, count)
    const { pageInfo } = page
    const { limitData } = pageInfo
    if (typeof search === 'object') {
      // searchKey = Object.keys(search)[0]
      searchValue = Object.values(search)[0]
    } else {
      // searchKey = 'name'
      searchValue = search || ''
    }
    offset = Number(offset)
    console.log(offset)
    const results = await News.findAll({
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
      }
      ],
      where: { title: { [Op.like]: `%${searchValue}%` } },
      limit: limitData,
      offset: offset,
      order: [
        ['id', 'asc']
      ]
    })
    return response(res, 'List of All News', { results, pageInfo })
  },
  readNewsDetail: async (req, res) => {
    const { id } = req.params
    const results = await News.findAll({
      where: { id: id },
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
      }]
    })
    if (results.length) {
      return response(res, `News detail ${id}`, { results })
    } else {
      return response(res, 'News Not found', {}, 404, false)
    }
  },
  createNews: (req, res) => {
    const { id } = req.user
    multerHelper(req, res, async function (err) {
      const { title, content, categoryId, name, postId } = req.body // name, postId is from
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
          content,
          categoryId,
          newsimage: image
        }
        try {
          console.log(data)
          const results = await News.create({
            ...data
          })

          // create transaction for tagsnews
          const dataTags = {
            name
          }
          let mytag = ''
          for (let x = 0; x < dataTags.name.length; x++) {
            const tags = dataTags.name[x]
            mytag += tags + ', '
            if (x === dataTags.name.length - 1) {
              mytag = mytag.slice(0, mytag.length - 2)
            }
          }
          const createTags = await Tags.create({
            name: mytag,
            postId: results.id
          })
          console.log(createTags)
          return response(res, 'News created successfully', { results })
        } catch (err) {
          return response(res, `${err.errors.map(e => e.message)}`, {}, 400, false)
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
