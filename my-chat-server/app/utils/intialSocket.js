const socketIO = require("socket.io")

const initialSocket = (server) =>{
    const io =  socketIO(server , {
        cors:{
            origin:"http://localhost:3000"
        }
    })
    return io
}


module.exports ={
    initialSocket
}