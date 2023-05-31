MATCH (p:Person {name: "Juanito"})-[m:Made]->(d:Deposit {id: "123"})
SET m.date = null