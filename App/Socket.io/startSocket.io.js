const { escutarEventos } = require("./Events/listeners")
const os = require("os")

function startSocket(app, DB) {

    const http = require("http")
    const server = http.createServer(app)
    const io = require("socket.io")(server, {
        cors: {
            origin: `http://${getLocalIpAddress()}:3000`
        }
    })

    console.log("\nIO Iniciado")

    // server-side
    io.on("connection", (socket) => {

        console.log(`Novo Usuário Conectado\nSocket ID ${socket.id}`);

        escutarEventos(socket, DB)

    });

    server.listen(3500)
    
    return io
    
}




module.exports = { startSocket }

function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
      const interface = interfaces[interfaceName];
      for (const address of interface) {
        if (!address.internal && address.family === 'IPv4') {
          return address.address;
        }
      }
    }
  }