const express = require('express')
const router = express.Router()

const {
  getAllAddresses,
} = require('../controllers/addresses')


router.route('/').get(getAllAddresses)



module.exports = router