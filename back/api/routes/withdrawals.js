const express = require('express')
const {
    getWithdrawls
 } = require('../controllers/withdrawals')

const router = express.Router();

router.route('/').get(getWithdrawls)

module.exports = router