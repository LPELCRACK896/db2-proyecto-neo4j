const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')


exports.getSuspiciosDepositFraud = asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()
    const query = `MATCH (p:Person)-[:MADE]->(d:Deposit)
    WHERE d.amount > 10000 AND d.state = 'pending'
    MERGE (d)-[:GENERATES]->(f:FraudBehavior {
      motive: 'Sospecha de fraude por depósito sospechoso',
      alert_level: 2
    })
    RETURN f
    `
    const result = await session.run(query)
    const nodes = result.records.map(record => record.get('f').properties);
    session.close()

    return res.status(200).json({msg: nodes.length?`Detected ${nodes.length}`:"No Fraud detected", data: nodes})
})