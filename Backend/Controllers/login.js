const {StatusCodes} = require('http-status-codes')
const {BadRequestError, InvalidAuthenticationError} = require('../Errors')

const login = async(req, res) => {
    const {id, email, password} = req.body

    if(!id || !email || !password){
        throw new BadRequestError('Provide id, email and password')
    }
}

module.exports = {login}

