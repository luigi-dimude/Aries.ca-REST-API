const mongoose = require('mongoose')
const moment = require('moment')
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');


const JobSchema = new mongoose.Schema({
    title : {
        type:String,
        lowercase: true,
        trim: true,
        required: true,
        maxLength: 30
    },
    contactPhoneNumber : {
        type: Number,
        match: [/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
        'Please provide canadian phone number']
    },
    contactEmail : {
        type: String,
        lowercase: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide valid email']
    },
    companyName : {
        type:String,
        trim: true,
        lowercase: true,
        default: 'n/a',
        maxLength: [40, 'Maximum of 40 characters']
    },
    description : {
        type: String,
        trim: true,
        required:[true, 'Please provide job description'],
        minLength: [40, 'Minimum of 40 characters'],
        maxLength: [550, 'Maximum of 550 characters']
    },
    hourlySalary : {
        type: Number,
        required:[true, 'Please provide hourly salary'],
        min: [5, 'Minimum of $5 per hour'],
        max: [9999, 'Maximum of $9999 per hour']
    },
    duration : {
        type: String,
        enum: ['Within a day', 'Few days', 'More than few days', 'Ongoing', 'N/A'],
        default: 'N/A',
        required: true
    },
    streetLocation : {
        type:String,
        trim: true,
        minLength: [5, 'Minimum of 5 characters'],
        maxLength: [100, 'Maximum of 100 characters'],
        default: 'N/A'
    },
    startDate : {
        type : Date,
        min : [moment().add(1, 'days'), 'Minimum start date should be at least a day from now'],
        max : [moment().add(122, 'days'), 'Maximum start date should be at most 122 days from now']
    },
    address : {
        type: mongoose.Types.ObjectId,
        ref:'Address',
        required:[true, 'Please provide address']
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true, 'Please provide user']
    }
}, {timestamps:true})

// JobSchema.index({title: 'text', description: 'text'});

JobSchema.plugin(mongoose_fuzzy_searching, { fields: ['title', 'description'] });



module.exports = mongoose.model('Job', JobSchema);