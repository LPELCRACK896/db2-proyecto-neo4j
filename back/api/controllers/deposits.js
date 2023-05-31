const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')

// @desc    Get all deposits
// @route   GET /api/v1/deposits
// @access   Public
exports.getDeposits = asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()
    const query = 'MATCH (c: Deposit) RETURN c'

    const result = await session.run(query)
    const nodes = result.records.map(record => record.get('c').properties);
    session.close()

    return res.status(200).json({msg: "Got all deposits", data: nodes})
})


// @desc    Get one deposit
// @route   GET /api/v1/deposits/:id
// @access   Public
exports.getDeposit = asyncHandler(async (req, res, next) => {

    const id = req.params.id
    const driver = req.driver
    const session = driver.session()

    const result = await session.run( `MATCH (c:Deposit {id: \"${id}\"}) RETURN c`)
    const nodes = result.records.map(record => record.get('c').properties);
    session.close()

    return res.status(200).json({msg: nodes.length?"Got a client related to that dpi": "Got no data.", data: nodes.length?nodes[0]:nodes})
})


