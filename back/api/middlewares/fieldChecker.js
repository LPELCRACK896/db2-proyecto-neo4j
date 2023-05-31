const ErrorResponse = require('../utils/errorResponse')

const fieldChecker = (fields) => {
    return (req, res, next) => {
        const missingFields = fields.filter(field => !(field in req.body));

        if (missingFields.length > 0) {
            return next(new ErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400));
        }

        next();
    };
};

module.exports = fieldChecker