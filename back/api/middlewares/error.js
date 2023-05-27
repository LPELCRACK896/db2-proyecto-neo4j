const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (err, req, res, next) =>{
    // Log to console for dev
    console.log(err)

    let error = {...err}
    error.message = err.message

    // Mongoose bad ObjecetID
    if(err.name === 'CastError')  {
        const message = `Resourse not found with id of ${err.value}`
        error = new ErrorResponse(message, 404)
    }
    // Mongoose duplicate key
    if(err.code === 11000){
        const message = 'Duplicates field value entered'
        error = new ErrorResponse(message, 400)
    } 
    // Mongoose validation error
    if (err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message)
        console.log(typeof(message))
        console.log(message)
        error = new ErrorResponse(message, 400)
    }
    res.status(error.statusCode || 500).json({
        succes: false, 
        error: error.message || 'Server error'
    })

}

module.exports = errorHandler