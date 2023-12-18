const { nameSpaceModel } = require("../../models/conversationModel")
const { userModel } = require("../../models/usermodel")


class NameSpaceSocket {
    #io 
    constructor(io){
        this.#io = io
        this.initConnection()
    }
    
    initConnection(){
        this.#io.on("connection" , async(socket)=>{
       

        const nameSpaces = await nameSpaceModel.find({} , {title: 1  , endpoint:1}).sort({_id:-1})
            socket.emit("nameSpacesList" , nameSpaces)
        })

    }

    createNameSpaceConnection = async () => {
        const nameSpaces = await nameSpaceModel.find({}).sort({ _id: -1 });
      
        for (const nameSpace of nameSpaces) {
          this.#io.of(`/${nameSpace.endpoint}`).on("connection", (socket) => {
            socket.on('joinRoom' , (roomName)=> {
              socket.join(roomName) 
              this.getCountOfOnlineUsers(nameSpace.endpoint , roomName) 
               this.getNewMessage(socket , roomName , nameSpace.endpoint )

         
              socket.on('disconnect' , async()=>{
                this.getCountOfOnlineUsers(nameSpace.endpoint , roomName)
              })

            }) 
            socket.emit('roomList', nameSpace.rooms);
          });
        }
          
      }
    
    


    getCountOfOnlineUsers = async(endpoint , roomName)=>{
      const socketConnections = await this.#io.of(`/${endpoint}`).in(roomName).allSockets()
      const onlineUsers = [...socketConnections]
      this.#io.of(`${endpoint}`).in(roomName).emit('onlineUsers' , onlineUsers.length)
    }
    
    getNewMessage  = (socket , roomName , endpoint)=>{
      socket.on('clientMessage' , async({message , email})=>{
        if(message){
          const {_id} = await userModel.findOne({email})
          const dateTime = new Date().toLocaleTimeString()
  
          const result = await nameSpaceModel.updateOne({endpoint , 'rooms.name' : roomName} ,
           {$push:{'rooms.$.messages': {
            message , 
            sender:_id,
            dateTime  
           }}}) 
           if(!result.modifiedCount) throw new Error("something went wrong") 
        }
  
        const nameSpaces = await nameSpaceModel.find({} , {rooms:1}).sort({ _id: -1 }).populate([{path:"rooms.messages.sender" , select:['email' ,'sender' , 'userName'] }])
         nameSpaces.forEach(nameSpace => {
          const room =  nameSpace.rooms.find(item => item.name == roomName)
          if(room){
            this.#io.of(`${endpoint}`).in(roomName).emit('roomInfo' , {messages :room.messages , endpoint, roomName  })
          }
         })
       
      })
    }  
}


module.exports = {
    NameSpaceSocket
}