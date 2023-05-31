const express = require('express')
const fieldChecker = require('../middlewares/fieldChecker');
const {
    getClients,
    getClient, 
    createClient
 } = require('../controllers/clients')

const router = express.Router();

router.route('/').get(getClients).post(fieldChecker(["dpi", "nit", "name", "average_income_pm"]), createClient)
router.route('/:id').get(getClient)


module.exports = router