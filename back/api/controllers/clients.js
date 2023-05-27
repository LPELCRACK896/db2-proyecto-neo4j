const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')

// @desc    Get all clients
// @route   GET /api/v1/clients
// @access   Public
exports.getClients = asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()

    const result = await session.run('MATCH (n) RETURN n')
    const nodes = result.records.map(record => record.get('n').properties);
    session.close()

    return res.status(200).json({msg: "First route created", data: nodes})
})

