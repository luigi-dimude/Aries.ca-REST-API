const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
    province:{
        type:String,
        trim: true,
        required: true,
        maxLength: 40
    },
    region:{
        type:String,
        trim: true,
        required: true,
        maxLength:40
    },
    city : {
        type: String,
        trim: true,
        required:true,
        maxLength: 40
    }
})


module.exports = mongoose.model('Address', AddressSchema);