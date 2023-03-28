const { startExpress } = require("./express/startExpress");
const { emitirEventos } = require("./Socket.io/Events/listeners");
const { startSocket } = require("./Socket.io/startSocket.io");

(async function () {

    // Iniciar Express
    const app = startExpress()

    // Start Socket
    const io = startSocket(app)
    
        // Listeners
        emitirEventos(io)

})()