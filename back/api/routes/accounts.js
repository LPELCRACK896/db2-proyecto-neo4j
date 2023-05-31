const express = require('express')
const {
    getAccount,
    getAccounts
 } = require('../controllers/accounts')

const router = express.Router();

router.route('/').get(getAccounts)
router.route('/:id').get(getAccount)

module.exports = router