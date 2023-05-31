const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')


// @desc    Get all withdrawls
// @route   GET /api/v1/withdrawls
// @access   Public
exports.getWithdrawls =  asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()
    const query = 'MATCH (w: Withdrawal) RETURN w' //Cambiar esta linea
    const result = await session.run(query)
    const nodes = result.records.map(record => record.get('w').properties);
    session.close()

    return res.status(200).json({msg: "Got all transfers", data: nodes})
})
