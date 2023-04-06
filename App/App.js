const {start_Database} = require("../Server/DB/Config/config_db");
const ServerRoutines = require("../Server/routines/main");
const { startExpress } = require("./express/startExpress");
const { emitirEventos } = require("./Socket.io/Events/listeners");
const { startSocket } = require("./Socket.io/startSocket.io");

(async function () {

    const DB = await start_Database();

    // Iniciar Express
    const app = startExpress()

    // Start Socket
    const io = startSocket(app, DB)

        // Listeners
        emitirEventos(io, DB)

    // Rodar as Rotinas do Servidor
    ServerRoutines()

})()