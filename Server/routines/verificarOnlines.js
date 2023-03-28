const path = require("path")
const fs = require("fs")
const colaboradoresPath = path.join(__dirname, "..", "Config", "Colaboradores.json")

function verificarOnlines(){
    console.log('Atualizando Colaboradores Online...')
    const json = JSON.parse(fs.readFileSync(colaboradoresPath))

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

    const colaboradoresOnlines = json.filter((colaborador)=>{

        const entrada_1 = colaborador.entrada_1
        const saida_1 = colaborador.saida_1
        const entrada_2 = colaborador.entrada_2
        const saida_2 = colaborador.saida_2
        
        if (verificarHoraAtualNoIntervalo(entrada_1, saida_1)){
            colaborador.ativo_ate = saida_1
            return true
        } else if (verificarHoraAtualNoIntervalo(entrada_2, saida_2)) {
            colaborador.ativo_ate = saida_2
            return true
        } 

    })
    
    colaboradoresofflines.forEach((colaborador)=>{
        colaborador.online = false
    })

    colaboradoresOnlines.forEach((colaborador)=>{
        colaborador.online = true
    })    

    fs.writeFileSync(colaboradoresPath, JSON.stringify(json))

    console.log(`Atualização concluída!`);

};

function verificarHoraAtualNoIntervalo(horaInicial, horaFinal) {
    
    const horaAtual = new Date();
    const [horaIni, minIni] = horaInicial.split(':');
    const [horaFim, minFim] = horaFinal.split(':');
  
    // Subtrai 30 minutos da hora final
    let minutosFim = parseInt(minFim, 10) - 30;
    let horasFim = parseInt(horaFim, 10);
  
    // Verifica se os minutos resultantes são negativos e ajusta as horas, se necessário
    if (minutosFim < 0) {
      minutosFim += 60;
      horasFim -= 1;
    }
    
    const horaInicialFormatada = new Date();
    horaInicialFormatada.setHours(horaIni, minIni, 0);

    const horaFinalReduzida = new Date();
    horaFinalReduzida.setHours(horasFim, minutosFim, 0);
    
    const tempoAtual = horaAtual.getTime();
    const tempoInicial = horaInicialFormatada.getTime();
    const tempoFinal = horaFinalReduzida.getTime();
  
    return (tempoAtual >= tempoInicial && tempoAtual <= tempoFinal);
  }


module.exports = verificarOnlines