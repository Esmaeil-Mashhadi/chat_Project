const { NameSpaceSocket } = require("./nameSpace.socket")

const socketHandler = (io)=>{
    new NameSpaceSocket(io).initConnection()
}


module.exports = {
    socketHandler
}