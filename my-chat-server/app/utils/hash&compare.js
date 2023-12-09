const {hash, compare} = require("bcrypt")
const hashPassword = (password)=>{
 return hash(password , 10) 
}

const verfiyPassword = (password , hashedPassword)=>{
  return compare(password , hashedPassword)
}

module.exports = {
    verfiyPassword ,
    hashPassword
}