const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes')
const {BadRequestError} = require('../errors')



const getAllJobsStatic = async (req, res) => {
    res.status(StatusCodes.OK).json({send: "works"});
}


const getAllJobs = async (req, res) => {
    const { search, address, fields, salaryRange, duration } = req.query;

    const queryObject = {};
  
    if (address && address !== 'Any') {
      queryObject.address = address;
    }
    if (duration && duration !== 'Any') {
      queryObject.duration = duration;
    }
  
   

    if (salaryRange) {
      // Get min and max salary range from query string
      const salary = salaryRange.split('-');
      const minSalary = salary[1];
      const maxSalary = salary[0];

      if (isNaN(minSalary) || isNaN(maxSalary)) {
        throw new BadRequestError('Please provide a range of salary')
      }

      let hourlySalary = {}

      // $lte (mongoDB) - less than or equal to
      // $gte (mongoDB) - greater than or equal to
      hourlySalary.$lte = minSalary
      hourlySalary.$gte = maxSalary

      queryObject.hourlySalary = hourlySalary;
    }

  
    let result = Job.find(queryObject);

    if (search) {
      // Fuzzy search based on title and description
      // Sorted based on confidence score
      result = result.fuzzySearch(search);
    }

    // Sort by newer jobs 
    // result = result.sort('-createdAt');

  
    if (fields) {
      const fieldsList = fields.split(',').join(' ');
      result = result.select(fieldsList);
    }

    // Pagination 
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit);
    const skip = (page - 1) * limit;
  
    result = result.skip(skip).limit(limit);
    // ----------------------------------------------
  
    // Await result after checking conditions and populate address
    const jobs = await result.populate('address');


    res.status(StatusCodes.OK).json({ jobs, numOfJobs: jobs.length });
  };



module.exports = {
    getAllJobsStatic,
    getAllJobs
  };