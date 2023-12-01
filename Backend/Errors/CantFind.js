// This error is used if a resource cannot be found in the database.

const CustomError = require('./custom')
const { StatusCodes } = require('http-status-codes')

class CantFindError extends CustomError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.NOT_FOUND // 404 STATUS CODE
  }
}

module.exports = CantFindError