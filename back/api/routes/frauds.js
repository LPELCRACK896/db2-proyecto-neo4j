const express = require('express')
const {
    getSuspiciosDepositFraud,
    getDicrepanceByIngreso,
    getSusRetirment,
    getUnusualSaldo
 } = require('../controllers/frauds')

const router = express.Router();

router.route('/deposit').get(getSuspiciosDepositFraud)
router.route('/ingreso').get(getDicrepanceByIngreso)
router.route('/withdrawal').get(getSusRetirment)
router.route('/saldo').get(getUnusualSaldo)

module.exports = router