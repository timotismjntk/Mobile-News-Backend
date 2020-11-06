/* eslint-disable camelcase */
const bcrypt = require('bcryptjs')
const response = require('../helpers/response')
const { User } = require('../models')

module.exports = {
  getUsers: async (req, res) => {
    const results = await User.findAll({
      offset: 0,
      limit: 1,
      attributes: {
        exclude: ['password']
      }
    })
    return response(res, 'List of All User', { results })
  },
  getUserById: async (req, res) => {
    const { id } = req.params
    const results = await User.findByPk(id)
    if (results) {
      return response(res, `Detail of user with id ${id}`, { results })
    }
    return response(res, 'User not found', { results }, 404, false)
  },
  updateUser: async (req, res) => {
    const { id } = req.params
    let { name, birthdate, email, password, phoneNumber, gender } = req.body
    const results = await User.findByPk(id)
    if (results) {
      if (name || birthdate || email || phoneNumber || gender) {
        const data = { name, birthdate, email, phoneNumber, gender }
        try {
          await results.update(data)
          return response(res, 'User updated successfully', { results })
        } catch (err) {
          return response(res, `${err.errors.map(e => e.message)}`, {}, 400, false)
        }
      } else if (password) {
        try {
          const salt = await bcrypt.genSalt()
          password = await bcrypt.hash(password, salt)
          const data = {
            name,
            birthdate,
            email,
            password,
            phoneNumber,
            gender
          }
          await results.update(data)
          return response(res, 'User updated successfully', { results })
        } catch (err) {
          return response(res, `${err.errors.map(e => e.message)}`, {}, 400, false)
        }
      }
      return response(res, 'Atleast fill one column', {}, 400, false)
    }
    return response(res, 'User not found', {}, 404, false)
  },
  deleteUser: async (req, res) => {
    const { id } = req.params
    const results = await User.findByPk(id)
    if (results) {
      await results.destroy()
      return response(res, 'User deleted successfully', {})
    }
    return response(res, 'User not found', {}, 404, false)
  }
}
