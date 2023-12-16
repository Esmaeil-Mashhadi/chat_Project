const path = require('path')

const handlImageUrl = (files , uploadPath)=>{
    if(Array.isArray(files)){
       let images =  files.map(file =>{
        return path.join(uploadPath, file.filename ).replace(/\\/g , '/')
       })
       return images
    }else{
        const imageUrl  = path.join(uploadPath , files.filename).replace(/\\/g , "/")
        return imageUrl

    }

}

module.exports = {
    handlImageUrl
}