MATCH (a:Account {number: 1234})-[r:INHERITS]->(p:Person {name: "Juanito"})
SET r.is_family = null