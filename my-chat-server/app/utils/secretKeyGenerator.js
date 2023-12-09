const crypto = require('crypto')
const secretKeyGenerator = ()=>{
   return crypto.randomBytes(32).toString('hex').toUpperCase()
}


module.exports ={
    secretKeyGenerator
}