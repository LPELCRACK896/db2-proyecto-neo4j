const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access   Public
exports.getClients = asyncHandler(async (req, res, next) => {
    return res.status(200).json({msg: "First route created"})
})

