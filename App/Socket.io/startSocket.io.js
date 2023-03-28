const { escutarEventos } = require("./Events/listeners")

function startSocket(app) {

    const http = require("http")
    const server = http.createServer(app)
    const io = require("socket.io")(server, {
        cors: {
            origin: "http://10.20.30.12:3000"
        }
    })

    console.log("\nIO Iniciado")

    // server-side
    io.on("connection", (socket) => {

        console.log(`Novo Usuário Conectado`);

        escutarEventos(socket)

    });

    server.listen(3500)
    
    return io
    
}




module.exports = { startSocket }