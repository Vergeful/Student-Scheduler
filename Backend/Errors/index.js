// This file allows all errors to be imported at once.

const CustomError = require('./CustomError')
const BadRequestError = require('./BadRequest')
const CantFindError = require('./CantFind')
const InvalidAuthenticationError = require('./InvalidAuthentication')

module.exports = {
    CustomError,
    BadRequestError,
    CantFindError,
    InvalidAuthenticationError
}