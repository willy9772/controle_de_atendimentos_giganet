const path = require("path")
const fs = require("fs")
const { log } = require("console")
const colaboradoresPath = path.join(__dirname, "..", "Config", "Colaboradores.json")

function limparAtendimentos() {

    if (verificarMeiaNoite()) { log(`Não é meia-noite!`); return }

    if (verificarSeJaFoiLimpo()){ log(`Atendimentos Já foram Limpos!`); return }
    
    console.clear()
    log(`Limpando atendimentos!`)

    RegistrarAtendimentos()

    Limpar()

    console.log(`Atendimentos Limpos`)
    
}

function verificarMeiaNoite() {
    const agora = new Date();
    if (agora.getHours() === 1 && agora.getMinutes() === 1) {
        return true
    } else {
        return false
    }
}

function Limpar(){
    
    const colaboradores = JSON.parse(fs.readFileSync(colaboradoresPath))
    
    colaboradores.forEach(colaborador => {

        colaborador.total_atendimentos = 0
        colaborador.total_vendas = 0
        
    });

    fs.writeFileSync(colaboradoresPath, JSON.stringify(colaboradores))
    
}

function RegistrarAtendimentos(){

    const colaboradores = JSON.parse(fs.readFileSync(colaboradoresPath))

    criarDiretorio()

    fs.writeFileSync(path.join(__dirname, "..", "Config", "backups", buscarDataAtual(), "Colaboradores.json"), JSON.stringify(colaboradores))

}

function criarDiretorio(){

    if(!fs.existsSync(path.join(__dirname, "..", "Config", "backups", buscarDataAtual()))) {
        fs.mkdirSync(path.join(__dirname, "..", "Config", "backups", buscarDataAtual()))
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