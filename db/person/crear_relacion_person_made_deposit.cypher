MATCH (p:Person {name: "Juanito"}), (d:Deposit {id: 2})
CREATE (p)-[m:Made]->(d)
SET m.id = "5", m.date = 2022-11-24