const createHttpError = require("http-errors")
const { verify } = require("jsonwebtoken");
const { userModel } = require("../../models/usermodel");

const verifyUser = async(req , res , next)=>{
    try {
        
        const refreshToken = req.cookies.authorization
        const{email , exp} = verify(refreshToken , process.env.REFRESH_SECRET_KEY)
        const user = await userModel.findOne({email})
        if(!user) throw createHttpError.NotFound("couldn't find the user")
        if(Date.now() > exp*1000) throw createHttpError.Gone("please login again")
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
    
}

module.exports = {
    verifyUser
}