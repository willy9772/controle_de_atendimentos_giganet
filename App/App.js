const { startExpress } = require("./express/startExpress");
const escutarEventos = require("./Socket.io/Events/listeners");
const { startSocket } = require("./Socket.io/startSocket.io");

(async function(){

    // Iniciar Express
    const app = startExpress()

    // Start Socket
    const io = startSocket(app)

    // Listeners
    escutarEventos(io)

})()