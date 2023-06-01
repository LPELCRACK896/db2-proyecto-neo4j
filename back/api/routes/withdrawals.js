const express = require('express')
const {
    getWithdrawals,
    getWithdrawal,
    createWithdrawal
 } = require('../controllers/withdrawals')
 const fieldChecker = require('../middlewares/fieldChecker');
 
const router = express.Router();

router.route('/').get(getWithdrawals).post(fieldChecker(["amount", "motive","location", "account_number", "dpi", "type"]), createWithdrawal)
router.route('/:id').get(getWithdrawal)

module.exports = router