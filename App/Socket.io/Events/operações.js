const fs = require("fs")
const path = require("path")

const colaboradoresPath = path.join(__dirname, "..", "..", "..", "Server", "Config", "Colaboradores.json")


function transferirAtendimento(colaborador, tipo, autor) {

    console.log(`Transferido um atendimento para o colaborador ${colaborador}, com o tipo ${tipo}, transferido por ${autor}`)

    const colaboradores = JSON.parse(fs.readFileSync(colaboradoresPath))

    const user = colaboradores.find(obj => obj.nome == colaborador)

    if (tipo == "Atendimento") {
        user.ultimo_atendimento = `${getCurrentDate()} ${getCurrentHour()}`
    } else if (tipo == "Venda") {
        user.ultima_venda = `${getCurrentDate()} ${getCurrentHour()}`
    }

    user.total_atendimentos++

    fs.writeFileSync(colaboradoresPath, JSON.stringify(colaboradores))

}

function sendSessionkey(socket){

    const sessionKey = socket.id

    socket.emit("new sessionKey", sessionKey)

    console.log(`Enviado chave da sessão ${socket.id}`);

    


    socket.on("disconnect", (user)=>{
        console.log(`O Socket ID ${socket.id} se desconectou`);
    })

}


module.exports = { transferirAtendimento, sendSessionkey }


function getCurrentHour() {

    const date = new Date

    const hour = date.getHours().toString().padStart(2, "0")
    const minute = date.getMinutes().toString().padStart(2, "0")

    return `${hour}:${minute}`

}

function getCurrentDate() {

    const date = new Date

    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, 0)
    const year = date.getFullYear().toString()

    return `${day}/${month}/${year}`

}