
const createHttpError = require('http-errors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { randomUUID } = require('crypto')

const storage = multer.diskStorage({
    destination:(req , file , cb)=>{
        const dest = path.join(__dirname ,'..' , '..' , '..' , 'my-chat' , 'public' , 'uploads')
        req.body.uploadPath = path.join('/uploads')
        fs.mkdirSync(dest , {recursive:true})
        cb(null , dest)
    },

    filename :(req, file , cb)=>{
        const name = file.originalname
        const ext = path.extname(name)
        const nameID = randomUUID()
        const fileName = path.join(nameID+ ext)
        cb(null , fileName)
    }
})

const imageFilter = (req , file , cb)=>{
    const validExt = ['.jpeg' , '.png' , '.webp' , '.jpg']
    const ext = path.extname(file.originalname)
    if(!validExt.includes(ext)) cb(createHttpError.BadRequest('image format is not valid'))
    cb(null , true)
}

const maxSize = 1000*1000*3
const imageUpload = multer({storage , limits:{fileSize:maxSize} , imageFilter})

module.exports ={
    imageUpload
}