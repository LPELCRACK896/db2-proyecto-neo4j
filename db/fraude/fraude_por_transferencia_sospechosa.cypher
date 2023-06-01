MATCH (a1:Account)-[:RECEIVED]->(t:Transfer)
WHERE t.amount > 10000 AND NOT (a1)-[:OWES]->(:Account)<-[:MADE]-(:Person)
CREATE (t)-[:GENERATES]->(f:FraudBehavior {
  motive: 'Sospecha de fraude por transferencia sospechosa',
  alert_level: 4
})
RETURN f