const { nameSpaceModel } = require("../../models/conversationModel")
const {EventEmitter} = require('events')


class NameSpaceSocket {
    #io 
    constructor(io){
        this.#io = io
        this.initConnection()
        this.createNameSpaceConnection()
    }
    
    initConnection(){
        this.#io.on("connection" , async(socket)=>{
           socket.on("clientMessage" , (data)=>{
               socket.emit("serverMessage" , data )
           })

        const nameSpaces = await nameSpaceModel.find({} , {title: 1  , endpoint:1}).sort({_id:-1})
            socket.emit("nameSpacesList" , nameSpaces)
        })


    }

    createNameSpaceConnection = async () => {
      this.#io.on('connection', async () => {
        const nameSpaces = await nameSpaceModel.find({}).sort({ _id: -1 });
        for (const nameSpace of nameSpaces) {
          this.#io.of(`/${nameSpace.endpoint}`).on("connection", (socket) => {
            socket.emit('roomList', nameSpace.rooms);
          });
        }
      });
          

      }
}


module.exports = {
    NameSpaceSocket
}