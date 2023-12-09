const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: {type:String , required:true},
    password: {type:String , required:true},
    refreshToken:{type:String , required:true},
    token:{type:String , required:true}
})


module.exports = {
    userModel : mongoose.model('users' , userSchema)
}

