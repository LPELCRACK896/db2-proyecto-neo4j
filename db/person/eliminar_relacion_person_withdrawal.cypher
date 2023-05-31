MATCH (p:Person {name: "juanito"})-[r:Recieved]->(w:Withdrawal {id: "123"})
DELETE r