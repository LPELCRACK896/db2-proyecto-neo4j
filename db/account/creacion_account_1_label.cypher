CREATE (a:Account {
  number: toInteger(rand() * 100000000),
  balance: toInteger(rand() * 100000000),
  account_type: "active",
  create_date: date({ year: 1990 + toInteger(rand() * 10), month: toInteger(rand() * 12) + 1, day: toInteger(rand() * 28) + 1}),
  closing_date: date({ year: 1990 + toInteger(rand() * 10), month: toInteger(rand() * 12) + 1, day: toInteger(rand() * 28) + 1}),
  expected_incoming_pm: rand() * 10000
})