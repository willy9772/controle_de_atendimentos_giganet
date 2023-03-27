function startSocket(app) {
    const http = require("http")
    const server = http.createServer(app)
    const io = require("socket.io")(server, {
        cors: {
            origin: "http://10.0.0.50:3000"
        }
    })

    console.log("\nSocket Iniciado")


    // server-side
    io.on("connection", (socket) => {
        console.log(`Novo Usuário Conectado`);
    });

    server.listen(3500)
    
    return io
    
}




module.exports = { startSocket }