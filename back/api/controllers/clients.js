const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')

// @desc    Get all clients
// @route   GET /api/v1/clients
// @access   Public
exports.getClients = asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()
    const query = 'MATCH (n) RETURN n'

    const result = await session.run(query)
    const nodes = result.records.map(record => record.get('n').properties);
    session.close()

    return res.status(200).json({msg: "Got all clients", data: nodes})
})


// @desc    Get one clients
// @route   GET /api/v1/clients/:id
// @access   Public
exports.getClient = asyncHandler(async (req, res, next) => {

    const id = req.params.id
    const driver = req.driver
    const session = driver.session()

    const result = await session.run( `MATCH (c:Client {dpi: ${id}}) RETURN c`)
    const nodes = result.records.map(record => record.get('c').properties);
    session.close()

    return res.status(200).json({msg: nodes.length?"Got a client related to that dpi": "Got no data.", data: nodes.length?nodes[0]:nodes})
})


