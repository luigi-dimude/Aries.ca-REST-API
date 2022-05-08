const Address = require('../models/Address')
const {StatusCodes} = require('http-status-codes')


const getAllAddresses = async (req,res) => {

    const {province, region, city} = req.query;

    const queryObject = {}

    if (province) {
        queryObject.province = province;
    }

    if (region) {
        queryObject.region = region;
    }

    if (city) {
        queryObject.city = city;
    }

    let result = Address.find(queryObject);

    result = result.sort('city');

    // Await result after checking conditions
    const addresses = await result;    

    res.status(StatusCodes.OK).json({addresses, count: addresses.length})

}




module.exports = {
    getAllAddresses,

}