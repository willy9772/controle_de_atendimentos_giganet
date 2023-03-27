const { startExpress } = require("./express/startExpress");
const { startSocket } = require("./Socket.io/startSocket.io");




(async function(){

    // Iniciar Express
    const app = startExpress()

    // Start Socket
    startSocket(app)



})()