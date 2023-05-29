const express = require('express')
const {
    getClients,
    getClient
 } = require('../controllers/clients')

const router = express.Router();

router.route('/').get(getClients)
router.route('/:id').get(getClient)

module.exports = router