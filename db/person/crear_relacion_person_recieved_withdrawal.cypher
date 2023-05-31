MATCH (p:Person {name: "Juanito"}), (w:Withdrawal {id: "2"})
CREATE (p)-[r:Recieved]->(w)
SET r.id = "5", r.date = 2022-11-24