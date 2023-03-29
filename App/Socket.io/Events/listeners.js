const fs = require("fs")
const path = require("path");
const verificarOnlines = require("../../../Server/routines/verificarOnlines");
const { transferirAtendimento, sendSessionkey } = require("./operações")
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

    sendSessionkey(io)

    io.on("transferir atendimento", (socket)=>{

        console.log(JSON.stringify(socket))

        transferirAtendimento(socket.colaborador, socket.tipo, socket.autor)

    })

    io.on("update colaboradores", (newFile)=>{
        
        let colaboradores = JSON.parse(fs.readFileSync(colaboradoresPath))

        colaboradores = newFile

        fs.writeFileSync(colaboradoresPath, JSON.stringify(colaboradores))

        console.log(`O arquivo de Colaboradores foi atualizado por um usuário`)

        verificarOnlines()

        io.emit("aviso", `Arquivo de configurações atualizado com sucesso!`)

    })

}


module.exports = { emitirEventos, escutarEventos }