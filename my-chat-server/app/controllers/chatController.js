const createHttpError = require("http-errors")
const { nameSpaceModel } = require("../../models/conversationModel")
const { deleteFileInPublic } = require("../utils/deleteFileInPublic")

class ChatController {
    addGroup = async(req , res , next)=>{
        try {   
          
            const {title , rooms} = req.body
            
            if(!title , !rooms.length) throw createHttpError.BadRequest("please add a title with at least one group")
            const endpoint = title.replace(/\s/g , "" ).toUpperCase()
       
            const conversation = await nameSpaceModel.create({title ,rooms , endpoint})
            if(!conversation) throw createHttpError.InternalServerError("failed to update conversation")

            return res.status(201).json({
                status:201, 
                data:{message :"chat created successfully"}
            })


        } catch (error) {
            deleteFileInPublic(req.body.images)
            next(error)
        }
    }
}


module.exports = {
    ChatController : new ChatController()
}


