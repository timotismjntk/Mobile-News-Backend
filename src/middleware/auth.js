const jwt = require('jsonwebtoken')
const response = require('../helpers/response')

module.exports = {
  authUser: async (req, res, next) => {
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.slice(7, authorization.length)
      try {
        const payload = await jwt.verify(token, process.env.APP_KEY)
        if (payload) {
          req.user = payload
          next()
        } else {
          return response(res, 'Unauthorized', {}, 401, false)
        }
      } catch (err) {
        return response(res, err.message, {}, 500, false)
      }
    } else {
      return response(res, 'Forbidden Access', {}, 403, false)
    }
  },
  authRole: (role) => {
    return (req, res, next) => {
      if (req.user.role_id !== role) {
        return response(res, 'You dont Have Access', {}, 401, false)
      }
      console.log(role)
      next()
    }
  },
  checkExpiredToken: async (req, res, next) => {
    const { authorization } = req.headers
    const token = authorization.slice(7, authorization.length)
    try {
      const payload = await jwt.verify(token, process.env.APP_KEY)
      if (payload) {
        console.log('token still valid')
        return response(res, 'token still valid', { payload })
      } else {
        return response(res, 'Unauthorized', {}, 401, false)
      }
    } catch (e) {
      if (e.message === 'jwt expired') {
        return response(res, 'Your session is expired, please log in again', {}, 401, false)
      } else {
        return response(res, e, {}, 500, false)
      }
    }
  }
}
