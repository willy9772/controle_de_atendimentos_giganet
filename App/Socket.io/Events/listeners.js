const fs = require("fs")
const path = require("path")
const colaboradoresPath = path.join(__dirname, "..", "..", "..", "Server", "Config", "Colaboradores.json")



function escutarEventos(io){

    fs.watchFile(colaboradoresPath, {persistent: true}, (eventType, fileName)=>{

        console.clear()
        console.log(`Arquivo Colaboradores atualizado e emitido ao FrontEnd`)

        io.emit("atualizar dashboard", {
            data: JSON.parse(fs.readFileSync(colaboradoresPath))
        })


    })

}


module.exports = escutarEventos