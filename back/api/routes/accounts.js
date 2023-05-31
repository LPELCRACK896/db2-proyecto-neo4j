const express = require('express')
const {
    getAccount,
    getAccounts,
    createAccount
 } = require('../controllers/accounts')
 const fieldChecker = require('../middlewares/fieldChecker');

const router = express.Router();

router.route('/')
    .get(getAccounts)
    .post(fieldChecker(["accountype", "balance", "expectedincomingpm", "dpi","dpi_inh"]), createAccount)
router.route('/:id').get(getAccount)

module.exports = router