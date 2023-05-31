const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const { toBigInt, toDate, convertNeo4jProps} = require('../utils/handleTypesNeo4j')

// @desc    Get all accounts
// @route   GET /api/v1/accounts
// @access   Public
exports.getAccounts = asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()
    const query = 'MATCH (n: Account) RETURN n' //Cambiar esta linea
    const result = await session.run(query)
    let nodes = result.records.map(record => record.get('n').properties);
    nodes = nodes.map(convertNeo4jProps);
    session.close()

    return res.status(200).json({msg: "Got all transfers", data: nodes})
})

// @desc    Get single account
// @route   GET /api/v1/accounts/:id
// @access   Public
exports.getAccount = asyncHandler(async (req, res, next) => {
    const id  = req.params.id
    const driver = req.driver
    const session = driver.session()
    const query = `MATCH (n: Account {number: toInteger(${id})}) RETURN n` //Cambiar esta linea
    console.log(query)
    const result = await session.run(query)
    let nodes = result.records.map(record => record.get('n').properties);
    nodes = nodes.map(convertNeo4jProps);
    session.close()

    return res.status(200).json({msg: nodes.length? "Got a transfer": "No data", data: nodes[0]})
})


