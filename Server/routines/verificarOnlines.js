const path = require("path")
const fs = require("fs")
const colaboradoresPath = path.join(__dirname, "..", "Config", "Colaboradores.json")

function verificarOnlines(){
    console.log('Lendo arquivo...')
    const json = JSON.parse(fs.readFileSync(colaboradoresPath))

    console.log('Filtrando colaboradores offline...')
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

    console.log('Filtrando colaboradores online...')
    const colaboradoresOnlines = json.filter((colaborador)=>{

        const entrada_1 = colaborador.entrada_1
        const saida_1 = colaborador.saida_1
        const entrada_2 = colaborador.entrada_2
        const saida_2 = colaborador.saida_2

        console.log(`Colaborador ${colaborador.nome}:`)
        console.log(`Entrada 1: ${entrada_1}`)
        console.log(`Saída 1: ${saida_1}`)
        console.log(`Entrada 2: ${entrada_2}`)
        console.log(`Saída 2: ${saida_2}`)
        
        if (verificarHoraAtualNoIntervalo(entrada_1, saida_1)){
            colaborador.ativo_ate = saida_1
            return true
        } else if (verificarHoraAtualNoIntervalo(entrada_2, saida_2)) {
            colaborador.ativo_ate = saida_2
            return true
        } 

    })
    
    console.log('Atualizando colaboradores offline...')
    colaboradoresofflines.forEach((colaborador)=>{
        colaborador.online = false
    })

    console.log('Atualizando colaboradores online...')
    colaboradoresOnlines.forEach((colaborador)=>{
        colaborador.online = true
    })    

    console.log('Escrevendo arquivo...')
    fs.writeFileSync(colaboradoresPath, JSON.stringify(json))

    console.log('Concluído!')
};

function verificarHoraAtualNoIntervalo(horaInicial, horaFinal) {
  const horaAtual = new Date();
  const [horaIni, minIni] = horaInicial.split(':');
  const [horaFim, minFim] = horaFinal.split(':');

  horaInicial = new Date();
  horaInicial.setHours(horaIni, minIni, 0);

  horaFinal = new Date();
  horaFinal.setHours(horaFim, minFim, 0);

  const tempoAtual = horaAtual.getTime();
  const tempoInicial = horaInicial.getTime();
  const tempoFinal = horaFinal.getTime();

  return (tempoAtual >= tempoInicial && tempoAtual <= tempoFinal);
}


module.exports = verificarOnlines