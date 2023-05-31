MATCH (a:Account {number: 5029779173}), (p:Person {dpi: 22})
CREATE (a)-[r:INHERITS]->(p)
SET r.percentage = 5, r.is_family = false, r.is_shared = true
