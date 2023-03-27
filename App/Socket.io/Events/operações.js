const fs = require("fs")
const path = require("path")

const colaboradoresPath = path.join(__dirname, "..", "..", "Server", "Colaboradores.json")


function adicionarAtendimento(colaborador, tipo, autor, io){

    const colaboradores = JSON.parse(fs.readFileSync(colaboradoresPath))

    const user = colaboradores.find(obj => obj.nome == colaborador)

    if (tipo == "Atendimento"){
        user.ultimo_atendimento = `${getCurrentDate()} ${getCurrentHour()}`
    } else if (tipo == "Venda" ){
        user.ultima_venda = `${getCurrentDate()} ${getCurrentHour()}`
    }




}





module.exports = {adicionarAtendimento }


function getCurrentHour(){

    const date = new Date

    const hour = date.getHours()
    const minute = date.getMinutes()

    return `${hour}:${minute}`

}

function getCurrentDate(){

    const date = new Date

    const day = date.getHours()
    const month = date.getMonth()
    const year = date.getFullYear()

    return `${day}/${month - 1}/${year}`

}