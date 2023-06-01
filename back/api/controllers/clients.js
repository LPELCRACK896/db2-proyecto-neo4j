const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')

// @desc    Get all clients
// @route   GET /api/v1/clients
// @access   Public
exports.getClients = asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()
    const query = 'MATCH (c: Client) RETURN c'

    const result = await session.run(query)
    const nodes = result.records.map(record => record.get('c').properties);
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

// @desc    Create one clients
// @route   POST /api/v1/clients
// @access   Public
exports.createClient = asyncHandler(async (req, res, next) => {

    const driver = req.driver
    const session = driver.session()
    const { dpi, nit, name, average_income_pm, label } = req.body

    const exist_dpi = await session.run(`MATCH (n: Person {dpi: toInteger($dpi)}) RETURN count(n) > 0 as exists`, { dpi })
    const exist_nit = await session.run(`MATCH (n: Person {nit: toInteger($nit)}) RETURN count(n) > 0 as exists`, { nit })
    if (exist_dpi.records[0].get('exists')){
        return next(new ErrorResponse(`El numero de DPI ya está asociado a una persona en la base de datos.`, 409))
    }
    if (exist_nit.records[0].get('exists')){
        return next(new ErrorResponse(`El numero de NIT ya está asociado a una persona en la base de datos.`, 409))
    }

    const variables = {name, dpi, nit, average_income_pm}
    let createQuery = `CREATE (c:Client:Person `
    
    if(label) {
        createQuery += `:${label} `
    }

    createQuery += `{ name: $name, dpi: toInteger($dpi), nit: toInteger($nit), average_income_pm: toFloat($average_income_pm)}) RETURN c`
    const result = await session.run(createQuery, variables)
    const client = result.records[0].get('c').properties;
    session.close()
    return res.status(201).json({ success: true, data: client });
})
