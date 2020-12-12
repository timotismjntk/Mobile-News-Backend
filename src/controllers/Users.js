/* eslint-disable camelcase */
const bcrypt = require('bcryptjs')
const response = require('../helpers/response')
const { Users } = require('../models')
const fs = require('fs')
const multerHelper = require('../helpers/multerHelper')
const multer = require('multer')

module.exports = {
  getAllUsers: async (req, res) => {
    const results = await Users.findAll({
      offset: 0,
      limit: 1,
      attributes: {
        exclude: ['password']
      }
    })
    return response(res, 'List of All User', { results })
  },
  getProfile: async (req, res) => {
    const { id } = req.user
    const results = await Users.findOne({
      where: { id: id },
      attributes: {
        exclude: ['password']
      }
    })
    if (results) {
      return response(res, `Detail of user with id ${id}`, { results })
    }
    return response(res, 'User not found', { results }, 404, false)
  },
  updateUser: async (req, res) => {
    multerHelper(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE' && req.file.length === 0) {
          fs.unlinkSync('assets/uploads/' + req.file.filename)
          return response(res, 'fieldname doesnt match', {}, 500, false)
        }
        return response(res, err.message, {}, 500, false)
      } else if (err) {
        fs.unlinkSync('assets/uploads/' + req.file.filename)
        return response(res, err.message, {}, 401, false)
      }
      try {
        const { id } = req.user
        let { name, birthdate, email, password, phoneNumber, gender } = req.body
        const results = await Users.findByPk(id)
        if (results) {
          if (req.file) {
            if (name || birthdate || email || phoneNumber || gender) {
              const picture = `uploads/${req.file.filename}`
              const data = {
                name,
                birthdate,
                email,
                phoneNumber,
                gender,
                avatar: picture
              }
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
                const picture = `uploads/${req.file.filename}`
                const data = {
                  name,
                  birthdate,
                  email,
                  password,
                  phoneNumber,
                  gender,
                  avatar: picture
                }
                await results.update(data)
                return response(res, 'User updated successfully', { results })
              } catch (err) {
                return response(res, `${err.errors.map(e => e.message)}`, {}, 400, false)
              }
            }
          } else {
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
        }
        return response(res, 'User not found', {}, 404, false)
      } catch (e) {
        if (req.file) {
          fs.unlinkSync('assets/uploads/' + req.file.filename)
          return response(res, e.message, {}, 500, false)
        }
      }
    })
  },
  deleteUser: async (req, res) => {
    const { id } = req.user
    const results = await Users.findByPk(id)
    if (results) {
      await results.destroy()
      return response(res, 'User deleted successfully', {})
    }
    return response(res, 'User not found', {}, 404, false)
  }
}
