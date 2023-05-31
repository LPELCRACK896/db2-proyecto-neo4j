const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')

// @desc    Get all persons
// @route   GET /api/v1/persons
// @access   Public
exports.getPersons = asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()
    const query = 'MATCH (p: Person) RETURN p' //Cambiar esta linea
    const result = await session.run(query)
    const nodes = result.records.map(record => {
        properties = record.get('p').properties
        
        return {"type": properties.hasOwnProperty('average_income_pm') ? 'Client' : 'Person',...properties}
    });
    console.log(nodes)
    session.close()

    return res.status(200).json({msg: "Got all persons", data: nodes})
})

// @desc    Get all persons
// @route   GET /api/v1/persons/:id
// @access   Public
exports.getPerson = asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()
    const id = req.params.id
    const query =  `MATCH (p: Person  {dpi: ${id}}) RETURN p`//Cambiar esta linea
    const result = await session.run(query)
    const nodes = result.records.map(record => {
        properties = record.get('p').properties
        return {"type": properties.hasOwnProperty('average_income_pm') ? 'Client' : 'Person',...properties}
    });
    session.close()

    return res.status(200).json({msg: nodes.length?"Got a person related to that dpi": "Got no data.", data: nodes.length?nodes[0]:nodes})
})



