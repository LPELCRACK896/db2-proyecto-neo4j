MATCH (c:Client)-[:Owes]->(a:Account)-[:MADE]->(d:Withdrawal)-[:GENERATES]->(f:FraudBehavior)
RETURN c.name,COUNT(f) AS numFrauds