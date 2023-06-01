const express = require('express')
const {
    getSuspiciosDepositFraud,
 } = require('../controllers/frauds')

const router = express.Router();

router.route('/deposit').get(getSuspiciosDepositFraud)

module.exports = router