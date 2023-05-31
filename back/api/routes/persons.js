const express = require('express')
const {
    getPersons,
    getPerson, 
    createClient
 } = require('../controllers/persons')
 const fieldChecker = require('../middlewares/fieldChecker');

const router = express.Router();

router.route('/').get(getPersons).post(fieldChecker(["name", "dpi"]), createClient)
router.route('/:id').get(getPerson)

module.exports = router