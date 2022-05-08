const express = require('express')
const router = express.Router()

const {
  getAllJobsStatic,
  getAllJobs,

} = require('../controllers/jobs')

// router.route('/').get(getAllJobs)
router.route('/static').get(getAllJobsStatic)

router.route('/').get(getAllJobs)



module.exports = router