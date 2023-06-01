MATCH (c:Client)-[r:Owes]->(a:Account)
WHERE a.balance > 15430
CREATE (c)-[:GENERATES]->(f:FraudBehavior {
  motive: 'Sospecha de fraude por saldo inusual',
  alert_level: 1
})
RETURN f