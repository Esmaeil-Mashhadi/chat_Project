const { Router } = require("express");
const { ChatController } = require("../controllers/chatController");
const { imageUpload } = require("../utils/multer");
const { groupsHandler } = require("../middlewares/groupsHandler");

const router = Router()


router.post('/add-groups' , imageUpload.array('image' , 4) , groupsHandler , ChatController.addGroup)



module.exports ={
    chatRoutes : router
}