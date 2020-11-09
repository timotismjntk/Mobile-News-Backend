/* eslint-disable node/handle-callback-err */
const { Users } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const response = require('../helpers/response')
const {
  APP_KEY
} = process.env

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body
    console.log(email)
    try {
      const isExist = await Users.findOne({ where: { email: email } })
      if (isExist) {
        console.log(isExist.dataValues)
        if (isExist.dataValues.password) {
          try {
            await bcrypt.compare(password, isExist.dataValues.password, (err, result) => {
              if (result) {
                jwt.sign({ id: isExist.dataValues.id, role_id: isExist.dataValues.role_id }, APP_KEY, (err, token) => {
                  return response(res, { token: token }, {}, 200, true)
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
    console.log(data)
    const results = await Users.create(data)
    return response(res, 'User created successfully', { results })
  }
  //   forgotPassword: async (req, res) => {
  //     const schema = joi.object({
  //       password: joi.string().required()
  //     })

//     let { value: results, error } = schema.validate(req.body)
//     if (error) {
//       return response(res, 'Error', { error: error.message }, 400, false)
//     } else {
//       const { email, password } = results
//       try {
//         const isExist = await authModel.checkUserExist({ email })
//         if (isExist.length > 0) {
//           const salt = await bcrypt.genSalt(10)
//           const hashedPassword = await bcrypt.hash(password, salt)
//           results = {
//             password: hashedPassword
//           }
//           const data = await authModel.signUp(results)
//           if (data.affectedRows) {
//             return response(res, 'Success to change password', { results }, 200, true)
//           }
//         }
//       } catch (e) {
//         return response(res, e.message, {}, 500, false)
//       }
//     }
//   }
}
