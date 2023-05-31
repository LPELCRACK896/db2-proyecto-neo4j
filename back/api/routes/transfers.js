const express = require('express')
const {
    getTransfers,
    getTransfer
 } = require('../controllers/transfers')

const router = express.Router();

router.route('/').get(getTransfers)
router.route('/:id').get(getTransfer)

module.exports = router