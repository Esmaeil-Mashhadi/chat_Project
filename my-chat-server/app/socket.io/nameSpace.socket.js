class NameSpaceSocket {
    #io 
    constructor(io){
        this.#io = io
        this.initConnection()
    }

    initConnection(){
        this.#io.on("connection" , (socket)=>{
           socket.on("clientMessage" , (data)=>{
               socket.emit("serverMessage" , data )
           })

           
        })
    }
}


module.exports = {
    NameSpaceSocket
}