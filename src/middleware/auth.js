const jwt = require('jsonwebtoken')
const responseStandard = require('../helpers/response')

module.exports = {
  authUser: async (req, res, next) => {
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.slice(7, authorization.length)
      try {
        const payload = await jwt.verify(token, process.env.APP_KEY)
        if (payload) {
          // console.log('this' +res)
          req.user = payload
          next()
        } else {
          return responseStandard(res, 'Unauthorized', {}, 401, false)
        }
      } catch (err) {
        return responseStandard(res, err.message, {}, 500, false)
      }
    } else {
      return responseStandard(res, 'Forbidden Access', {}, 403, false)
    }
  },
  authRole: (role) => { // authentication to access admin page
    return (req, res, next) => {
      if (req.user.role_id !== role) {
        return responseStandard(res, 'You dont Have Access', {}, 401, false)
      }
      console.log(role)
      next()
    }
  }
}
