MATCH (c:Cliente {name: "Usuario1"})
SET c:ClienteVIP
REMOVE c:Cliente