const fs = require("fs")
const path = require("path")

const colaboradoresPath = path.join(__dirname, "..", "..", "..", "Server", "Config", "Colaboradores.json")


function adicionarAtendimento(colaborador, tipo, autor) {

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





module.exports = { adicionarAtendimento }


function getCurrentHour() {

    const date = new Date

    const hour = date.getHours()
    const minute = date.getMinutes()

    return `${hour}:${minute}`

}

function getCurrentDate() {

    const date = new Date

    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, 0)
    const year = date.getFullYear().toString()

    return `${day}/${month}/${year}`

}