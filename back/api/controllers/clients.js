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


// @desc    Update properties of a client
// @route   PUT /api/v1/clients/:id
// @access   Public
exports.updateClientProperties = asyncHandler(async (req, res, next) => {

    const id = req.params.id
    const driver = req.driver
    const session = driver.session()
    const { dpi, nit, name, average_income_pm } = req.body

    const updateQuery = `
        MATCH (c:Client {dpi: ${id}})
        SET c.dpi = coalesce($dpi, c.dpi), 
            c.nit = coalesce($nit, c.nit),
            c.name = coalesce($name, c.name),
            c.average_income_pm = coalesce($average_income_pm, c.average_income_pm)
        RETURN c
    `

    const result = await session.run(updateQuery, { dpi, nit, name, average_income_pm })
    const client = result.records[0].get('c').properties;
    session.close()

    return res.status(200).json({msg: "Client's properties updated successfully", data: client})
})

// @desc    Update labels of a client
// @route   PUT /api/v1/clients/:id/label
// @access   Public
exports.updateClientLabel = asyncHandler(async (req, res, next) => {

    const id = req.params.id
    const driver = req.driver
    const session = driver.session()
    const { label } = req.body

    const updateLabelQuery = `
        MATCH (c:Client {dpi: ${id}})
        REMOVE c:Client
        SET c:${label}
        RETURN c
    `

    const result = await session.run(updateLabelQuery)
    const client = result.records[0].get('c').properties;
    session.close()

    return res.status(200).json({msg: "Client's label updated successfully", data: client})
})

// @desc    Add label to a client
// @route   PUT /api/v1/clients/:id/addlabel
// @access   Public
exports.addClientLabel = asyncHandler(async (req, res, next) => {

    const id = req.params.id
    const driver = req.driver
    const session = driver.session()
    const { label } = req.body

    const addLabelQuery = `
        MATCH (c:Client {dpi: ${id}})
        SET c:${label}
        RETURN c
    `

    const result = await session.run(addLabelQuery)
    const client = result.records[0].get('c').properties;
    session.close()

    return res.status(200).json({msg: "Client's label added successfully", data: client})
})
