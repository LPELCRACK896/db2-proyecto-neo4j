const express = require('express')
const fieldChecker = require('../middlewares/fieldChecker');
const {
    getClients,
    getClient, 
    createClient,
    updateClientProperties,
    updateClientLabel,
    addClientLabel
 } = require('../controllers/clients')

const router = express.Router();

router.route('/')
    .get(getClients)
    .post(fieldChecker(["dpi", "nit", "name", "average_income_pm"]), createClient)

router.route('/:id')
    .get(getClient)
    .put(fieldChecker(["dpi", "nit", "name", "average_income_pm"]), updateClientProperties)

router.route('/:id/label')
    .put(fieldChecker(["label"]), updateClientLabel)

router.route('/:id/addlabel')
    .put(fieldChecker(["label"]), addClientLabel)

module.exports = router
