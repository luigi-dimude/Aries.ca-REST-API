const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');


const register = async (req,res) => {

    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name: user.firstName},token})

}

const login = async (req,res) => {
    const {email, password} = req.body

    if(!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    // Check if user exist
    const user = await User.findOne({email})

    if (!user) {
        throw new UnauthenticatedError('User email does not exist')
    }

    // Check if password is valid
    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect) {
        throw new UnauthenticatedError('Password is invalid')
    }

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({user:{name:user.firstName}, token})
}


module.exports = {
    register,
    login,
}