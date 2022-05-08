const Job = require('../models/Job')
const Address = require('../models/Address')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const moment = require('moment')


const getAllJobs = async (req,res) => {

    // Find all jobs filter by showing only user's jobs
    const jobs = await Job.find({createdBy:req.user.userId})
    .sort('-createdAt').populate('address')

    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}

const getJob = async (req,res) => {
    // Get user and id parameter from request object
    const {
        user:{userId}, 
        params:{id:jobId}
    } = req
    
    // Find the job
    job = await Job.findOne({
        _id:jobId,
        createdBy:userId
    }).populate('address')

    if(!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job})
}

const createJob = async (req,res) => {

    let saveJob = {};
    

    // Get user Id
    const createdBy = req.user.userId;


    const {title, contactPhoneNumber, contactEmail, companyName, description,
        hourlySalary, duration, streetLocation, startDate,
        province, region, city} = req.body;

    
    // VALIDATIONS --------------------------------------------
    
     // Requires user to provide either 
    if (!contactPhoneNumber && !contactEmail ) {
            
            throw new BadRequestError('Please provide contact phone number or email');
        }
    
    if (contactPhoneNumber && String(contactPhoneNumber).length !== 10) {
        throw new BadRequestError('Invalid phone number')
    }
    if ( !(moment(startDate, "YYYY-MM-DD").isValid()) ) {
        throw new BadRequestError('Invalid date format');
    }

    // Required for getting address id
    if (!province || !region || !city ) {
            throw new BadRequestError('Please provide province, region and the city');
        }


    const jobAddress = await Address.findOne({province, region, city})

    if (!jobAddress) {
            throw new NotFoundError(`No address found`)
        }
      
    // -----------------------------------------------------------------
    
        saveJob = {
            title,
            contactPhoneNumber,
            contactEmail,
            companyName,
            description,
            hourlySalary, 
            duration,
            streetLocation,
            startDate,
            createdBy,
            address : String(jobAddress._id)
        };

    const job = await Job.create(saveJob)

    res.status(StatusCodes.CREATED).json(job)
}

const updateJob = async (req,res) => {

    let saveJob = {};

    const {
        body: {title, contactPhoneNumber, contactEmail, companyName, description,
            hourlySalary, duration, streetLocation, startDate,
            province, region, city},
        user:{userId}, 
        params:{id:jobId}
    } = req

    // VALIDATIONS --------------------------------------------

    // Requires user to provide either 
    if (!contactPhoneNumber  && !contactEmail ) {
        throw new BadRequestError('Please provide contact phone number or email');
    }

    if (contactPhoneNumber && String(contactPhoneNumber).length !== 10) {
        throw new BadRequestError('Invalid phone number')
    }
    if (companyName == null) {
        throw new NotFoundError(`Company name cannot be null`)
    }
    
    if ( !(moment(startDate, "YYYY-MM-DD").isValid()) ) {
        throw new BadRequestError('Invalid date format');
    }

     // Required for getting address id
     if (!province || !region || !city ) {
        throw new BadRequestError('Please provide province, region and the city');
    }

    let jobAddress = await Address.findOne({province, region, city})

    if (!jobAddress) {
        throw new NotFoundError(`No address found`)
    }
    // -----------------------------------------------------------------
    
    

    saveJob = {
        title,
        contactPhoneNumber,
        contactEmail,
        companyName : companyName.trim() == "" ? "n/a" : companyName,
        description,
        hourlySalary, 
        duration,
        streetLocation,
        startDate,
        createdBy:userId,
        address : String(jobAddress._id)
    };

    job = await Job.findOneAndUpdate({
        _id:jobId,
        createdBy:userId
    },
    saveJob,
    {new: true, runValidators:true,}
    );

    if(!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async (req,res) => {
    const {
        user:{userId}, 
        params:{id:jobId}
    } = req

    const job = await Job.findByIdAndRemove({
        _id:jobId,
        createdBy:userId
    })

    if(!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).send();
}


module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,

}