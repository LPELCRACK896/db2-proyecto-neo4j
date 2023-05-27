const express = require('express')
const {
    getClients
 } = require('../controllers/clients')

const router = express.Router();

router.route('/').get(getClients)

module.exports = router