const path = require("path")
const fs = require("fs")
const { log } = require("console");

async function limparAtendimentos() {

    if (verificarSeJaFoiLimpoHoje()){ return }
    
    console.clear()
    log(`Limpando Atendimentos!`)

    const { databases } = require("../DB/Config/config_db");
    const colaboradoresdb = databases.bds[0]

    const backUp = await colaboradoresdb.findAll({})

    fs.writeFileSync(path.join(__dirname, "..", "Config", "backups", buscarDataAtual(), "Colaboradores.json"), JSON.stringify(backUp))

    backUp.forEach((user)=>{
        user.update({total_atendimentos: 0, total_vendas: 0})
    })

}

function buscarDataAtual() {

    const date = new Date()

    const day = date.getDate().toString().padStart(2, 0)
    const month = (date.getMonth() + 1).toString().padStart(2, 0)
    const year = date.getFullYear().toString()

    return `${day}-${month}-${year}`

}

function verificarSeJaFoiLimpoHoje(){

    if (fs.existsSync(path.join(__dirname, "..", "Config", "backups", buscarDataAtual()))){
        return true
    } else {
        fs.mkdirSync(path.join(__dirname, "..", "Config", "backups", buscarDataAtual()))
        return false
    }

}

module.exports = { limparAtendimentos }