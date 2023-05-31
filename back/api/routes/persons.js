const express = require('express')
const {
    getPersons,
    getPerson
 } = require('../controllers/persons')

const router = express.Router();

router.route('/').get(getPersons)
router.route('/:id').get(getPerson)

module.exports = router