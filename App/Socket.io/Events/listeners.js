const fs = require("fs")
const path = require("path")
const { transferirAtendimento } = require("./operações")
const colaboradoresPath = path.join(__dirname, "..", "..", "..", "Server", "Config", "Colaboradores.json")



function emitirEventos(io) {

    console.log(`Emitindo Eventos`);

    // Enviar atualização à Dashboard
    fs.watch(colaboradoresPath, { persistent: true }, (eventType, fileName) => {

        console.log(`Arquivo Colaboradores atualizado e emitido ao FrontEnd`)

        io.emit("atualizar dashboard", {
            data: JSON.parse(fs.readFileSync(colaboradoresPath))
        })

    })

}

function escutarEventos(io){

    console.log(`Escutando Eventos`);

    io.on("transferir atendimento", (socket)=>{

        console.log(JSON.stringify(socket))

        transferirAtendimento(socket.colaborador, socket.tipo, socket.autor)

    })

}


module.exports = { emitirEventos, escutarEventos }