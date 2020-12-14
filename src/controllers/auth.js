/* eslint-disable node/handle-callback-err */
const { Users } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const response = require('../helpers/response')
const { v4: uuidv4 } = require('uuid')
const { Op } = require('sequelize')
const {
  APP_KEY,
  TOKEN_EXP
} = process.env

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)
    try {
      const isExist = await Users.findOne({ where: { email: email } })
      if (isExist) {
        console.log(isExist.dataValues)
        if (isExist.dataValues.password) {
          try {
            await bcrypt.compare(password, isExist.dataValues.password, (err, result) => {
              if (result) {
                jwt.sign({ id: isExist.dataValues.id, role_id: isExist.dataValues.role_id }, APP_KEY, { expiresIn: TOKEN_EXP }, (err, token) => {
                  return response(res, 'Login Success', { token }, 200, true)
                })
              } else {
                return response(res, 'Wrong email or password', {}, 400, false)
              }
            })
          } catch (e) {
            return response(res, e.message, {}, 500, false)
          }
        }
      } else {
        console.log(isExist)
        return response(res, 'Wrong email or password', {}, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  signUp: async (req, res) => {
    let { fullname, birthdate, email, password, gender } = req.body
    password = await bcrypt.hash(password, await bcrypt.genSalt())
    const data = {
      fullname,
      birthdate,
      email,
      password,
      gender,
      role_id: 2
    }
    try {
      const isExist = await Users.findOne({ where: { email: email } })
      if (!isExist) {
        console.log(data)
        const results = await Users.create(data)
        return response(res, 'User created successfully', { results })
      } else {
        console.log(isExist)
        return response(res, 'Error email has been used', { }, 400, false)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  },
  getResetCode: async (req, res) => {
    const { email } = req.body
    const isExist = await Users.findOne({ where: { email } })
    if (isExist) {
      let resetCode = uuidv4()
      resetCode = resetCode.slice(0, 6)
      const sendResetCode = await isExist.update({ resetCode: resetCode })
      if (sendResetCode) {
        return response(res, 'Reset Code sent successfully', { result: resetCode })
      }
    } else {
      return response(res, 'Email isn\'t registered', {}, 404)
    }
  },
  resetPasswordVerifiyResetCode: async (req, res) => {
    const { resetCode, email } = req.body
    try {
      const isResetCodeMatch = await Users.findOne({
        where: {
          [Op.and]: [
            {
              email: email
            },
            {
              resetCode: resetCode
            }
          ]
        }
      })
      if (isResetCodeMatch) {
        return response(res, 'Reset Code is Same', {})
      } else {
        return response(res, 'Reset Code doesn\'t Same', {}, 400)
      }
    } catch (e) {
      return response(res, e.message, {}, 500, false)
    }
  }
}
