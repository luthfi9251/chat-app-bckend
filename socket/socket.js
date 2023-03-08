
const socketServer = (server) => {
    const io = require("socket.io")(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
    });

    io.on("connection", async (socket) => {
        console.log(`User Connected ${socket.id}`)
        socket.on("join room", data => {
            console.log(`Someone Joined room ${data}`)
            if(socket.currentRoom) socket.leave(socket.currentRoom)
            socket.join(data)
            socket.currentRoom = data
        })

        socket.on("message", (data) => {
            console.log(`Sending chat to ${data.roomActive}`)
            io.to(socket.currentRoom).emit("incoming", data)
        })

        socket.on('disconnect', ()=>{
            console.log("User Disconnect")
        })
    });
}

module.exports = {
    socketServer
}