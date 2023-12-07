// This error will be used by authenticate.js in Controllers and Middleware:
// a. if user doesn't exist or incorrect password is entered
// b. if req.headers.authorization doesn't exist, doesn't start with Bearer or if the JWT cannot be verified.

const CustomError = require('../Errors/CustomError')
const { StatusCodes } = require('http-status-codes')

class InvalidAuthenticationError extends CustomError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED // 401 STATUS CODE
  }
}

module.exports = InvalidAuthenticationError