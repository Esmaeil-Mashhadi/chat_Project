const { default: mongoose, model } = require("mongoose");


const messageSchema = new mongoose.Schema({
    sender: {type:mongoose.Types.ObjectId , ref:"users"},
    message:{type: String},
    dateTime:{type: String}

})

const roomSchema = new mongoose.Schema({
 name: {type: String} , 
 description: {type: String},
 image : {type: String},
 messages: {type: [messageSchema] , default :[]}
})

const nameSpaceSchema = new mongoose.Schema({
    title : {type: String  , required: true},
    endpoint : {type: String  , required: true},
    rooms: {type: [roomSchema] , default :[]}

})


module.exports = {
    nameSpaceModel : model("nameSpace" , nameSpaceSchema)
}