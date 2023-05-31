MATCH (cliente:Cliente {name: "Juan Perez"})-[r:LE_PERTENECE]->(cuenta:Cuenta {account_number: 123456789})
SET r.star_capital = 5, r.is_favourite = false, r.create_date = date()