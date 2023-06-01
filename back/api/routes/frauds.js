const express = require('express')
const {
    getSuspiciosDepositFraud,
    getDicrepanceByIngreso,
    getSusRetirment
 } = require('../controllers/frauds')

const router = express.Router();

router.route('/deposit').get(getSuspiciosDepositFraud)
router.route('/discrep').get(getDicrepanceByIngreso)
router.route('/suswithdrawal').get(getSusRetirment)

module.exports = router