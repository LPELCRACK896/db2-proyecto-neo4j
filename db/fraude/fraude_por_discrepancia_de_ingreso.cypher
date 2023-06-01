MATCH (c:Client)-[:Owes]->(a:Account)
WHERE c.average_income > a.expected_incoming_pm
MERGE (c)-[:GENERATES]->(f:FraudBehavior {
  id: 'fraud_behavior_id',
  acusation: 'Sospecha de fraude por discrepancia de ingresos',
  gravity: 2,
  actions: [],
  mount_related: 0
})
RETURN f