const createHttpError = require("http-errors")
const { sign } = require("jsonwebtoken")
require('dotenv').config({path:"../../.env"})

const signAccessToken = (payload)=>{

    return new Promise((resolve , reject)=>{
        const secretKey = process.env.USER_SECRET_KEY
        
        sign(payload ,secretKey , {expiresIn:1000*60} , async(err , token)=>{
            if(err) throw createHttpError.InternalServerError("something went wrong !")
             resolve(token)
        } )

    })
}


const signRefreshToken = (payload)=>{
    const refeshSecretKey = process.env.REFRESH_SECRET_KEY

    const token = sign(payload , refeshSecretKey , {expiresIn:"7d"})
    return token
   
}





module.exports ={
    signAccessToken,
    signRefreshToken
}