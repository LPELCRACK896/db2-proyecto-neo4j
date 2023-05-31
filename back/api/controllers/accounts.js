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

// @desc    Create one account
// @route   POST /api/v1/accounts
// @access   Public
exports.createAccount = asyncHandler(async (req, res, next) => {
    const driver = req.driver;
    const session = driver.session();
    const { accountype, balance, expectedincomingpm, dpi, dpi_inh } = req.body;
  
    const exist_client_dpi = await session.run(`MATCH (n: Client {dpi: toInteger($dpi)}) RETURN count(n) > 0 as exists`, { dpi })
    const exist_person_dpi = await session.run(`MATCH (n: Person {dpi: toInteger($dpi)}) RETURN count(n) > 0 as exists`, { dpi: dpi_inh })

    if (!exist_client_dpi.records[0].get('exists')){
        return next(new ErrorResponse(`Not existing client with dpi ${dpi}`, 404))
    }
    if (!exist_person_dpi.records[0].get('exists')){
        return next(new ErrorResponse(`Not existing person with dpi ${dpi_inh}`, 404))
    }
    let unique = false;
    let randomNumber;

    // Generate a unique random number
    while (!unique) {
      randomNumber = Math.floor(100000 + Math.random() * 900000);
      const result = await session.run(`MATCH (a:Account {number: ${randomNumber}}) RETURN a`);
      if (result.records.length === 0) {
        unique = true;
      }
    }
  
    const createQuery = `
      CREATE (a:Account {
        number: ${randomNumber},
        balance: toFloat($balance),
        account_type: $accountype,
        create_date: date(),
        expected_incoming_pm: toFloat($expectedincomingpm)
      })
      RETURN a`;
  
    const result = await session.run(createQuery, { accountype, balance, expectedincomingpm });
    const account = result.records[0].get('a').properties;

    // Creating relationship between client and account
    const clientToAccountQuery = `
      MATCH (c:Client {dpi: toInteger($dpi)}), (a:Account {number: ${randomNumber}})
      CREATE (c)-[r:Owes { start_capital: toFloat($balance), is_favourite: False, create_date: date() }]->(a)
    `;
    await session.run(clientToAccountQuery, { dpi, balance });

    // Creating relationship between account and person
    const accountToPersonQuery = `
      MATCH (a:Account {number: ${randomNumber}}), (p:Person {dpi: toInteger($dpi_inh)})
      CREATE (a)-[r:Inherits { percentage: 100, is_family: False, is_shared: False }]->(p)
    `;
    await session.run(accountToPersonQuery, { dpi_inh });

    session.close();
  
    return res.status(201).json({ success: true, data: account });
});

