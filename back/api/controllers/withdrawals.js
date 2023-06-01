const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const uuid = require('uuid');


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

exports.createWithdrawal = asyncHandler(async (req, res, next) => {
    const driver = req.driver;
    const session = driver.session();
    const { amount, motive, location, account_number, dpi, type } = req.body;

    // Check if the withdrawal amount is valid
    if (parseFloat(amount)<0){
        return next(new ErrorResponse(`Ingrese un número valido a retirar.`, 404));
    }

    // Check if account exists
    const exist_account = await session.run(`MATCH (a: Account {number: toInteger($number)}) RETURN count(a) > 0 as exists`, { number: account_number });
    if (!exist_account.records[0].get('exists')) {
        return next(new ErrorResponse(`No existing account with number ${account_number}`, 404));
    }

    // Fetch account details
    let accountDetails = await session.run(`MATCH (a: Account {number: toInteger($number)}) RETURN a`, {number: account_number});
    accountDetails = (accountDetails.records.map(record => record.get('a').properties)).map(convertNeo4jProps)[0];

    // Check account state
    if (accountDetails.state=="closed"){
        return next(new ErrorResponse(`Account (${account_number}), is currently closed.`, 403));
    }

    // Check account balance
    if (accountDetails.balance<=amount){
        return next(new ErrorResponse(`Account has no enough balance to this transaction. Balance: $${accountDetails.balance}>$${amount}`));
    }

    // Decrease the balance of the account
    await session.run("MATCH (a:Account {number: toInteger($number)}) SET a.state = $state, a.balance = $new_balance", {
        number: account_number,
        state: "active",
        new_balance: parseInt(accountDetails.balance)-parseFloat(amount)
    });

    // Check if person exists
    const exist_person = await session.run(`MATCH (p: Person {dpi: toInteger($dpi)}) RETURN count(p) > 0 as exists`, { dpi });
    if (!exist_person.records[0].get('exists')){
        return next(new ErrorResponse(`Not existing person with dpi ${dpi}`, 404));
    }

    const withdrawalId = uuid.v4();
    const createQuery = `
    CREATE (w:Withdrawal {id: $id, amount: $amount, motive: $motive, state: $state, type: $type, location: point({x:toFloat($location.x), y:toFloat($location.y)}), date: datetime()})
    WITH w
    MATCH (a:Account {number: toInteger($account_number)}), (p:Person {dpi: toInteger($dpi)})
    CREATE (a)-[:MADE {date: datetime()}]->(w)
    CREATE (p)-[:RECEIVED {date: datetime()}]->(w)
    RETURN w
    `;
    const result = await session.run(createQuery, {
        id: withdrawalId,
        amount: parseFloat(amount),
        motive,
        state: "completed",
        type,
        location,
        account_number,
        dpi
    });
    const withdrawalDetails = result.records[0].get('w').properties;

    return res.status(200).json({success: true, msg: "Withdrawal created successfully", data: withdrawalDetails});
});
