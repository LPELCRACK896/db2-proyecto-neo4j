MATCH (p:Person {name: "Juanito"})-[r:Recieved]->(w:Withdrawal {id: "123"})
SET r.date = null