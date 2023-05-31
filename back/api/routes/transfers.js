const express = require('express')
const {
    getTransfers,
    getTransfer,
    createTansfer,

 } = require('../controllers/transfers');
const fieldChecker = require('../middlewares/fieldChecker');

const router = express.Router();

router.route('/')
    .get(getTransfers)
    .post(fieldChecker(["number_origin", "number_destiny", "motive", "type", "amount"]), createTansfer)
router.route('/:id').get(getTransfer)

module.exports = router