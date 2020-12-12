const response = require('../helpers/response')
const { Tags } = require('../models')

module.exports = {
  readAllTags: async (req, res) => {
    const results = await Tags.findAll()
    return response(res, 'List of All Tags', { results })
  },
  createTags: async (req, res) => {
    const { name, postId } = req.body
    const data = {
      name
    }
    // console.log(name.concat([]))
    let mytag = ''
    for (let x = 0; x < data.name.length; x++) {
      const tags = data.name[x]
      mytag += tags + ', '
      if (x === data.name.length - 1) {
        mytag = mytag.slice(0, mytag.length - 2)
      }
    }
    const newData = {
      name: mytag,
      postId: 1
    }
    const results = await Tags.create(newData)
    return response(res, 'Tags News created successfully', { results })
  },
  editTags: async (req, res) => {
    const { id } = req.params
    const { name, postId } = req.body
    const results = await Tags.findByPk(id)
    if (results) {
      if (name) {
        const data = {
          name
        }
        let mytag = ''
        for (let x = 0; x < data.name.length; x++) {
          const tags = data.name[x]
          mytag += tags + ', '
          if (x === data.name.length - 1) {
            mytag = mytag.slice(0, mytag.length - 2)
          }
        }
        const newData = {
          name: mytag,
          postId: 1
        }
        try {
          await results.update(newData)
          return response(res, 'Tags News updated successfully', { results })
        } catch (err) {
          return response(res, `${err.errors.map(e => e.message)}`, {}, 400, false)
        }
      } else {
        try {
          const data = {
            name,
            postId
          }
          await results.update(data)
          return response(res, 'Tags News updated successfully', { results })
        } catch (err) {
          return response(res, `${err.errors.map(e => e.message)}`, {}, 400, false)
        }
      }
    }
    return response(res, 'Tags not found', {}, 404, false)
  },
  deleteTags: async (req, res) => {
    const { id } = req.params
    const results = await Tags.findByPk(id)
    if (results) {
      await results.destroy()
      return response(res, 'Tags deleted successfully', {})
    }
    return response(res, 'Tags not found', {}, 404, false)
  }
}
