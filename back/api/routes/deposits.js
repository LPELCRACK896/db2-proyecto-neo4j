const express = require('express')
const {
    getDeposits,
    getDeposit
 } = require('../controllers/deposits')

const router = express.Router();

router.route('/').get(getDeposits)
router.route('/:id').get(getDeposit)

module.exports = router