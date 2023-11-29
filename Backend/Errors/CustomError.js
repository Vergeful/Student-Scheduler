// All errors extend this class and have their own unique status codes:
class CustomError extends Error{
    constructor(message){
        super(message)
    }
}

module.exports = CustomError