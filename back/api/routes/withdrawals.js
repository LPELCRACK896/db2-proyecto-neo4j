const express = require('express')
const {
    getWithdrawals,
    getWithdrawal
 } = require('../controllers/withdrawals')

const router = express.Router();

router.route('/').get(getWithdrawals)
router.route('/:id').get(getWithdrawal)

module.exports = router