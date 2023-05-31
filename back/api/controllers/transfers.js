const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const fieldChecker = require('../middlewares/fieldChecker')
const { existAccountByNumber } = require('../middlewares/nodes/accounts')
const {convertNeo4jProps} = require('../utils/handleTypesNeo4j')
const stripSpaces = require('../utils/stripspaces')
const uuid = require('uuid');


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


// @desc    Create one transfer
// @route   POST /api/v1/transfers
// @access   Public
// @body     number_origin, number_destiny, motive, type,  amount
exports.createTansfer = asyncHandler(async (req, res, next) => {

    const driver = req.driver
    const session = driver.session()

    const body  = req.body
    const number_origin = stripSpaces(body.number_origin)
    const number_destiny = stripSpaces(body.number_destiny)

    //Verifica amount
    if (parseFloat(req.body.amount)<0){
        return next(new ErrorResponse(`Ingrese un número valido a transferir.`, 404))
    }
    
    const exist_number_origin = await session.run(`MATCH (n: Account {number: toInteger($number)}) RETURN count(n) > 0 as exists`, { number: number_origin })
    
    if (!exist_number_origin.records[0].get('exists')){
        return next(new ErrorResponse(`Not exsiting account (origin) with number ${number_origin}`, 404))
    }
    //Verifica que existan las cuentas
    const exist_number_destiny = await session.run(`MATCH (n: Account {number: toInteger($number)}) RETURN count(n) > 0 as exists`, { number: number_destiny })
    if (!exist_number_destiny.records[0].get('exists')){
        return next(new ErrorResponse(`Not exsiting account (destiny) with number ${number_destiny}`, 404))
    }
    if (number_destiny===number_origin){
        return next(new ErrorResponse("Cannot create transferce to same account", 400))
    }
    //Obtiene la información de las cuentas
    let node_account_origin = await session.run(`MATCH (n: Account {number: toInteger($number)}) RETURN n`, {number: number_origin})
    node_account_origin = (node_account_origin.records.map(record => record.get('n').properties)).map(convertNeo4jProps)[0]
    
    let node_account_destiny = await session.run(`MATCH (n: Account {number: toInteger($number)}) RETURN n`, {number: number_destiny})
    node_account_destiny = (node_account_destiny.records.map(record => record.get('n').properties)).map(convertNeo4jProps)[0]

    //Verifica si las cuentas estan disponibles para realizar transaccion
    if (node_account_origin.state=="closed"){
        return next(new ErrorResponse(`Account origin (${number_origin}), is currently closed.`, 403))
    }
    if (node_account_destiny.state=="closed"){
        return next(new ErrorResponse(`Account destiny (${number_destiny}), is currently closed.`, 403))
    }

    //Verifica que el saldo de la cuenta origen
    if (node_account_origin.balance<=body.amount){
        return next(new ErrorResponse(`Account origin has no enough balance to this transaction. Balance: $${node_account_origin.balance}>$${body.amount}`))
    }

    // Actualiza el balance  y estado de la cuenta destino y origen 
    await session.run("MATCH (a:Account {number: toInteger($number)}) SET a.state = $state, a.balance = $new_balance", {number: number_origin, state: "active", new_balance:parseInt(node_account_origin.balance)-body.amount })
    await session.run("MATCH (a:Account {number: toInteger($number)}) SET a.state = $state, a.balance = $new_balance", {number: number_destiny, state: "active", new_balance:parseInt(node_account_destiny.balance)+body.amount })

    //Crea transaccion
    const transferId = uuid.v4();
    const transferQuery = `
    CREATE (t:Transfer {id: $id, amount: $amount, motive: $motive, state: $state, type: $type}) 
    WITH t
    MATCH (origin:Account {number: toInteger($number_origin)}), (destiny:Account {number: toInteger($number_destiny)}) 
    CREATE (origin)-[:MADE]->(t) 
    CREATE (destiny)-[:RECEIVED]->(t)
    RETURN t
    `;
    const result = await session.run(transferQuery, {
        id: transferId,
        amount: parseFloat(body.amount),
        motive: body.motive,
        state: "completed",
        type: body.type,
        number_origin: number_origin,
        number_destiny: number_destiny
    });        
    const transferDetails = result.records[0].get('t').properties;

    return res.status(200).json({success: true, msg: "Transfer created successfully",  data: transferDetails})
})


