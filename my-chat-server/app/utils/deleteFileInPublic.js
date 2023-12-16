const fs = require('fs')
const path = require('path')

const deleteFileInPublic = (images)=>{
    if(Array.isArray(images)){
        images.forEach(image =>{
          const filePath = path.join(__dirname , ".." , ".." , 'public' , image)
         if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath)
         }
        })
    }else{
        const filePath = path.join(__dirname , ".." , ".." , 'public' , images)
        if(fs.existsSync(filePath)){
           fs.unlinkSync(filePath)
        }
    }
}

module.exports ={
    deleteFileInPublic
}