const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')


// @desc    Get all transfers
// @route   GET /api/v1/transfers
// @access   Public
exports.getTransfers = asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()
    const query = 'MATCH (n: Transfer) RETURN n' //Cambiar esta linea
    const result = await session.run(query)
    const nodes = result.records.map(record => record.get('n').properties);
    session.close()

    return res.status(200).json({msg: "Got all transfers", data: nodes})
})

// @desc    Get all transfers
// @route   GET /api/v1/transfers/:id
// @access   Public
exports.getTransfer = asyncHandler(async (req, res, next) => {
    const id  = req.params.id
    const driver = req.driver
    const session = driver.session()
    const query = `MATCH (n: Transfer {id: \"${id}\"}) RETURN n` //Cambiar esta linea
    const result = await session.run(query)
    const nodes = result.records.map(record => record.get('n').properties);
    session.close()

    return res.status(200).json({msg: nodes.length? "Got a transfer": "No data", data: nodes[0]})
})


