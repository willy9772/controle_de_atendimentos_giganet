const path = require("path")
const fs = require("fs")
const { log } = require("console")
const colaboradoresPath = path.join(__dirname, "..", "Config", "Colaboradores.json")

function limparAtendimentos() {

    if (verificarMeiaNoite()) { log(`Não é meia-noite!`); return }

/*     if (verificarSeJaFoiLimpo()){ log(`Atendimentos Já foram Limpos!`); return }
     */

    
}

function verificarMeiaNoite() {
    const agora = new Date();
    if (agora.getHours() === 1 && agora.getMinutes() === 1) {
        return true
    } else {
        return false
    }
}

function buscarDataAtual() {

    const date = new Date()

    const day = date.getDate().toString().padStart(2, 0)
    const month = (date.getMonth() + 1).toString().padStart(2, 0)
    const year = date.getFullYear().toString()

    return `${day}-${month}-${year}`

}

function verificarSeJaFoiLimpo(){

    if (fs.existsSync(path.join(__dirname, "..", "Config", "backups", buscarDataAtual()))){
        return true
    } else {
        return false
    }

}

module.exports = { limparAtendimentos }