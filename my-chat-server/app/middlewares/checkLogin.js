const createHttpError = require("http-errors");
const { userModel } = require("../../models/usermodel");

const checkLogin = async(req , res , next)=>{
 try {
        const token = req.signedCookies['authorization']
        if(token){
            const user = await userModel.findOne({token})
            req.user = user;
            return next()
        }
        throw createHttpError.Unauthorized("Please login first")
 } catch (error) {
    next(error)
 }
}

module.exports = {
    checkLogin
}