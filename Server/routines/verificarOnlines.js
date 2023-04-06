const path = require("path")
const fs = require("fs")
const { log } = require("console")

async function verificarOnlines() {
    const { databases } = require("../DB/Config/config_db")
    console.log('Atualizando Colaboradores Online...')

    const colaboradores_db = databases.bds[0]

    const colaboradores = await colaboradores_db.findAll({})

    colaboradores.forEach(async (colaborador) => {

        const entrada_1 = colaborador.entrada_1
        const entrada_2 = colaborador.entrada_2
        const saida_1 = colaborador.saida_1
        const saida_2 = colaborador.saida_2
        const horario_entrada_sabado = colaborador.horario_entrada_sabado
        const horario_saida_sabado = colaborador.horario_saida_sabado

        if (verificarSeéFimDeSemana()) {

            if (verificarHoraAtualNoIntervalo(horario_entrada_sabado, horario_saida_sabado)) {
                colaborador.update({ online: true, ativo_ate: horario_saida_sabado })
                return
            }

            colaborador.update({ online: false })
            return

        }

        if (verificarHoraAtualNoIntervalo(entrada_1, saida_1)) {
            colaborador.update({ online: true, ativo_ate: saida_1 })
            return
        }
        
        if (verificarHoraAtualNoIntervalo(entrada_2, saida_2)) {
            colaborador.update({ online: true, ativo_ate: saida_2 })
            return
        }

        colaborador.update({ online: false })

    })

    console.log(`Atualização Concluída!!`);

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

function verificarSeéFimDeSemana() {

    const data = new Date()
    return data.getDay() == 6 || data.getDay() == 0 ? true : false

}


module.exports = verificarOnlines