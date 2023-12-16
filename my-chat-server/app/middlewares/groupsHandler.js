const createHttpError = require("http-errors")
const { handlImageUrl } = require("../utils/handleImageUrl")
const { deleteFileInPublic } = require("../utils/deleteFileInPublic")

const groupsHandler = (req ,res , next)=>{
    let images 
    try {

        const files = req.files
        const {name , description , uploadPath} = req.body
        const rooms = []
        if(!Array.isArray(name) || !Array.isArray(description)){
            images =  handlImageUrl(files , uploadPath)
            
            rooms.push({name , description , images})
        }else{
            images = handlImageUrl(files , uploadPath);
            console.log(images);
            [...Array(name.length)].forEach((_,i)=>{
                let roomObject = {};
                
                roomObject.name = name[i]
                roomObject.description = description[i] 
                roomObject.image = images[i]
                rooms.push(roomObject)
                
            })
            
        }
        
        req.body.rooms = rooms
        req.body.images = images
        next()
        
    } catch (error) {
         deleteFileInPublic(images)
        next(error)
    }
}


module.exports ={
    groupsHandler
}