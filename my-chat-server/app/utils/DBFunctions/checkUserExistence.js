const createHttpError = require("http-errors")
const { userModel } = require("../../../models/usermodel")

const checkUserExistence = async(email)=>{
    const user =  await userModel.findOne({email})
    if(user) throw createHttpError.BadRequest("user already exist")
}



module.exports = {
    checkUserExistence
}