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

exports.getDicrepanceByIngreso = asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()
    const query = `MATCH (c:Client)-[:OWES]->(a:Account)
    WHERE c.average_income > a.expected_incoming_pm
    MERGE (c)-[:SUSPECTS]->(f:FraudBehavior {
      id: 'fraud_behavior_id',
      acusation: 'Sospecha de fraude por discrepancia de ingresos',
      gravity: 2,
      actions: [],
      mount_related: 0
    })
    RETURN f
    `
    const result = await session.run(query)
    const nodes = result.records.map(record => record.get('f').properties);
    session.close()

    return res.status(200).json({msg: nodes.length?`Detected ${nodes.length}`:"No Fraud detected", data: nodes})
})

exports.getSusRetirment = asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()
    const query = `MATCH (a:Account)-[:MADE]->(w:Withdrawal)
    WHERE w.amount > 10000 AND a.balance < w.amount
    MERGE (w)-[:GENERATES]->(f:FraudBehavior {
      motive: 'Sospecha de fraude por retiro sospechoso',
      alert_level: 3
    })
    RETURN f
    `
    const result = await session.run(query)
    const nodes = result.records.map(record => record.get('f').properties);
    session.close()

    return res.status(200).json({msg: nodes.length?`Detected ${nodes.length}`:"No Fraud detected", data: nodes})
})

exports.getUnusualSaldo = asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()
    const query = `MATCH (c:Client)-[r:Owes]->(a:Account)
    WHERE a.balance > 15430
    MERGE (c)-[:GENERATES]->(f:FraudBehavior {
      motive: 'Sospecha de fraude por saldo inusual',
      alert_level: 1
    })
    RETURN f
    `
    const result = await session.run(query)
    const nodes = result.records.map(record => record.get('f').properties);
    session.close()

    return res.status(200).json({msg: nodes.length?`Detected ${nodes.length}`:"No Fraud detected", data: nodes})
})

exports.getUnusualTransfer = asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()
    const query = `MATCH (a1:Account)-[:RECEIVED]->(t:Transfer)
    WHERE t.amount > 10000 AND NOT (a1)-[:OWES]->(:Account)<-[:MADE]-(:Person)
    MERGE (t)-[:GENERATES]->(f:FraudBehavior {
      motive: 'Sospecha de fraude por transferencia sospechosa',
      alert_level: 4
    })
    RETURN f
    `
    const result = await session.run(query)
    const nodes = result.records.map(record => record.get('f').properties);
    session.close()

    return res.status(200).json({msg: nodes.length?`Detected ${nodes.length}`:"No Fraud detected", data: nodes})
})

exports.getUnusualUser = asyncHandler(async (req, res, next) => {
    const driver = req.driver
    const session = driver.session()
    const query = `MATCH (c:Client)-[:Owes]->(a:Account)-[:MADE]->(d:Withdrawal)-[:GENERATES]->(f:FraudBehavior)
    RETURN c.name as name, COUNT(f) AS numFrauds
    `
    const result = await session.run(query)
    const records = result.records
    session.close()

    const nodes = records.map(record => {
        return {
            name: record.get('name'),
            numFrauds: record.get('numFrauds').toNumber(), // Convert Neo4j Integer to JavaScript Number
        };
    });

    return res.status(200).json({msg: nodes.length?`Detected ${nodes.length}`:"No Fraud detected", data: nodes})
})
