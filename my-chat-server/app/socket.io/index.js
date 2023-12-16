const { NameSpaceSocket } = require("./nameSpace.socket")

const socketHandler = (io)=>{
    new NameSpaceSocket(io).initConnection()
    new NameSpaceSocket(io).createNameSpaceConnection()
}


module.exports = {
    socketHandler
}