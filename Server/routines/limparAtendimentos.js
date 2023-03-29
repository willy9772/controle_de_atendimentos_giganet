const path = require("path")
const fs = require("fs")
const colaboradoresPath = path.join(__dirname, "..", "Config", "Colaboradores.json")

function limparAtendimentos() {

    if (!verificarMeiaNoite) { return }

    const colaboradores = JSON.parse(fs.readFileSync(colaboradoresPath))

    colaboradores.forEach(colaborador => {

        colaborador.total_atendimentos = 0

    });

    console.clear()

    fs.writeFileSync(colaboradoresPath, JSON.stringify(colaboradores))

    console.log(`Atendimentos Limpos`)

}

function verificarMeiaNoite() {
    const agora = new Date();
    if (agora.getHours() === 0 && agora.getMinutes() === 0 && agora.getSeconds() === 0) {
        return true
    } else {
        return false
    }
}

module.exports = { limparAtendimentos }