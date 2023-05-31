MATCH (a:Account {number: 5029779173})-[r:INHERATES]->(p:Person {dpi: 23})
SET r.percentage = 5, r.is_family = false, r.is_shared = true