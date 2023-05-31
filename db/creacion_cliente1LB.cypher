CREATE (c:Cliente {
  name: "Usuario5",
  address: "Dirección5",
  dpi: toInteger(rand() * 100000000),
  birthday: date({ year: 1990 + toInteger(rand() * 10), month: toInteger(rand() * 12) + 1, day: toInteger(rand() * 28) + 1}),
  phone: toString(toInteger(rand() * 1000000000)),
  occupation: "Ocupación5",
  nit: "NIT5",
  average_income: rand() * 10000
})