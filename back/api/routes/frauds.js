const express = require('express')
const {
    getSuspiciosDepositFraud,
    getDicrepanceByIngreso,
    getSusRetirment
 } = require('../controllers/frauds')

const router = express.Router();

router.route('/deposit').get(getSuspiciosDepositFraud)
router.route('/ingreso').get(getDicrepanceByIngreso)
router.route('/withdrawal').get(getSusRetirment)

module.exports = router