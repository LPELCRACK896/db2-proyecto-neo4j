const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')


// @desc    Get all withdrawls
// @route   GET /api/v1/withdrawals
// @access   Public
exports.getWithdrawals =  asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()
    const query = 'MATCH (w: Withdrawal) RETURN w' //Cambiar esta linea
    const result = await session.run(query)
    const nodes = result.records.map(record => record.get('w').properties);
    session.close()

    return res.status(200).json({msg: "Got all withdrawals", data: nodes})
})


// @desc    Get single withdrawal
// @route   GET /api/v1/withdrawals/:id
// @access   Public
exports.getWithdrawal =  asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const driver = req.driver
    const session = driver.session()
    const query =  `MATCH (w: Withdrawal {id: \"${id}\"}) RETURN w`//Cambiar esta linea
    const result = await session.run(query)
    const nodes = result.records.map(record => record.get('w').properties);
    session.close()

    return res.status(200).json({msg: nodes.length?"Got all withdrawals":"No data related to that id", data: nodes[0]})
})