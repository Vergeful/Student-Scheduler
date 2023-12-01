const CustomError = require('./custom')
const { StatusCodes } = require('http-status-codes')

class BadRequestError extends CustomError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.BAD_REQUEST // 400 STATUS CODE
  }
}

module.exports = BadRequestError