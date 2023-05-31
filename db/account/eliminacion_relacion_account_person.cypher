MATCH (a:Account {number: 1234})-[r:INHERITS]->(p:Person {name: "Juantio"})
DELETE r