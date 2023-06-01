MATCH (p:Person)-[:MADE]->(d:Deposit)
WHERE d.amount > 10000 AND d.state = 'pending'
MERGE (d)-[:GENERATES]->(f:FraudBehavior {
  motive: 'Sospecha de fraude por depósito sospechoso',
  alert_level: 2
})
RETURN f