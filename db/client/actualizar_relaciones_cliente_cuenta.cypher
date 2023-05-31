MATCH (c:Client {name: "Juan Perez"})-[r:Owes]->(a:Account {account_number: 123456789})
SET r.create_date = 1921-11-04, r.is_favourite = false, r.start_capital = 123.12