const path = require("path")
const fs = require("fs")
const colaboradoresPath = path.join(__dirname, "..", "Config", "Colaboradores.json")

function verificarOnlines(){

    const json = JSON.parse(fs.readFileSync(colaboradoresPath))

    // Faz o Filtro

    const colaboradoresOnlines = json.filter((colaborador)=>{

        const entrada_1 = colaborador.entrada_1
        const saida_1 = colaborador.saida_1
        const entrada_2 = colaborador.entrada_2
        const saida_2 = colaborador.saida_2

        if (verificarHoraAtualNoIntervalo(entrada_1, saida_1)){
            return true
        } else if (verificarHoraAtualNoIntervalo(entrada_2, saida_2)) {
            return true
        } 

    })
    
    const colaboradoresofflines = json.filter((colaborador)=>{
        
        const entrada_1 = colaborador.entrada_1
        const saida_1 = colaborador.saida_1
        const entrada_2 = colaborador.entrada_2
        const saida_2 = colaborador.saida_2
        
        if (!verificarHoraAtualNoIntervalo(entrada_1, saida_1)){
            return true
        } else if (!verificarHoraAtualNoIntervalo(entrada_2, saida_2)) {
            return true
        } 

        
    })
   
    // Altera o Objeto

    colaboradoresOnlines.forEach((colaborador)=>{

        colaborador.online = true

    })
    
    colaboradoresofflines.forEach((colaborador)=>{

        colaborador.online = false

    })

    // Escreve novamente
    
    fs.writeFileSync(colaboradoresPath, JSON.stringify(json))

}

function verificarHoraAtualNoIntervalo(horaInicial, horaFinal) {
  const horaAtual = new Date();
  horaInicial = new Date(`2000-01-01T${horaInicial}:00`);
  horaFinal = new Date(`2000-01-01T${horaFinal}:00`);

  const tempoAtual = horaAtual.getTime();
  const tempoInicial = horaInicial.getTime();
  const tempoFinal = horaFinal.getTime();

  return (tempoAtual >= tempoInicial && tempoAtual <= tempoFinal);
}


module.exports = verificarOnlines