MATCH (cliente:Cliente {name: "Juan Perez"})-[r:LE_PERTENECE]->(cuenta:Cuenta {account_number: 123456789})
SET r.is_favourite = null