MATCH (p:Person {name: "Juanito"})-[m:Made]->(d:Deposit {id: "132"})
DELETE m