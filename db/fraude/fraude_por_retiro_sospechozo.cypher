MATCH (a:Account)-[:MADE]->(w:Withdrawal)
WHERE w.amount > 10000 AND a.balance < w.amount
MERGE (w)-[:GENERATES]->(f:FraudBehavior {
  motive: 'Sospecha de fraude por retiro sospechoso',
  alert_level: 3
})
RETURN f