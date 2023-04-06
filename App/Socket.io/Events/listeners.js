const verificarOnlines = require("../../../Server/routines/verificarOnlines");

function emitirEventos(io, DB) {

    colaboradores_Db = DB.bds[0]
    let cache_colaboradores = []

    setInterval(async () => {

        const arquivo = await colaboradores_Db.findAll({})

        if(verificarSeAtualizou(cache_colaboradores, arquivo)){
            io.emit("atualizar dashboard", {
                data: arquivo
            })

            cache_colaboradores = arquivo

            // Enviar atualização à Dashboard
            console.log(`Arquivo Colaboradores atualizado e emitido ao FrontEnd`)
        }


    }, 500)

}

function escutarEventos(io, DB) {

    console.log(`Escutando Eventos`);

    io.on("transferir atendimento", async (socket) => {

        const { databases } = require("../../../Server/DB/Config/config_db")
        const colaboradores_db = databases.bds[0]

        const query = await colaboradores_db.findOne({ where: { nome: socket.colaborador } })

        if (query) {
            let ultimo_valor
            if (socket.tipo == "Atendimento") {
                ultimo_valor = Number(query.total_atendimentos) + 1
                await query.update({ total_atendimentos: ultimo_valor, ultimo_atendimento: buscar_data_e_hora() })
            } else if (socket.tipo == "Venda") {
                ultimo_valor = Number(query.total_vendas) + 1
                await query.update({ total_vendas: ultimo_valor, ultima_venda: buscar_data_e_hora() })
            }

        } else {
            io.emit("aviso", `Colaborador não encontrado!`)
        }
    })

    io.on("update colaboradores", (colaboradores_a_atualizar) => {

        const { databases } = require("../../../Server/DB/Config/config_db")
        const colaboradores_db = databases.bds[0]

        colaboradores_a_atualizar.forEach(async (colaborador) => {

            const nome = colaborador.nome
            const atende = colaborador.atende
            const vende = colaborador.vende
            const setor = colaborador.setor
            const entrada_1 = colaborador.entrada_1
            const entrada_2 = colaborador.entrada_2
            const saida_1 = colaborador.saida_1
            const saida_2 = colaborador.saida_2
            const horario_entrada_sabado = colaborador.horario_entrada_sabado
            const horario_saida_sabado = colaborador.horario_saida_sabado

            if (
                !verificar_horarios(entrada_1, saida_1) ||
                !verificar_horarios(saida_1, entrada_2) ||
                !verificar_horarios(entrada_2, saida_2) ||
                !verificar_horarios(horario_entrada_sabado, horario_saida_sabado)
            ) {
                io.emit("aviso", `O horário do colaborador ${nome} está errado e a partir dele não foi mais atualizado, por favor verifique e tente novamente.`)
                return
            }

            await colaboradores_db.findOne({ where: { nome: nome } }).then(async (result) => {

                await result.update({
                    setor: setor,
                    entrada_1: entrada_1,
                    entrada_2: entrada_2,
                    saida_1: saida_1,
                    saida_2: saida_2,
                    horario_entrada_sabado: horario_entrada_sabado,
                    horario_saida_sabado: horario_saida_sabado,
                    atende: atende,
                    vende: vende,
                })

            })

        })

        io.emit("aviso", `Colaboradores atualizados com sucesso!`)

        verificarOnlines()

    })

}


module.exports = { emitirEventos, escutarEventos }

function buscar_data_e_hora() {

    const data = new Date

    const dia = data.getDate().toString().padStart(2, 0)
    const mes = (data.getMonth() + 1).toString().padStart(2, 0)
    const ano = data.getFullYear().toString()

    const hora = data.getHours().toString().padStart(2, 0)
    const min = data.getMinutes().toString().padStart(2, 0)

    return `${dia}/${mes}/${ano} ${hora}:${min}`

}

function verificar_horarios(horario_1, horario_2) {

    const [hora_1, min_1] = horario_1.split(":")
    const [hora_2, min_2] = horario_2.split(":")

    if (hora_1 > 24 || hora_2 > 24) { return false }
    if (min_1 > 59 || min_2 > 59) { return false }

    if (hora_2 < hora_1) { return false }

    return true

}

function verificarSeAtualizou(cache, novo_arquivo){

    try {
    for (let i = 0; i < novo_arquivo.length; i++) {
        const colaborador = novo_arquivo[i];
        const cache_colaborador = cache[i]

        if (cache_colaborador.entrada_1 != colaborador.entrada_1){ return true }
        if (cache_colaborador.entrada_2 != colaborador.entrada_2){ return true }
        if (cache_colaborador.online != colaborador.online){ return true }
        if (cache_colaborador.saida_1 != colaborador.saida_1){ return true }
        if (cache_colaborador.saida_2 != colaborador.saida_2){ return true }
        
        if (cache_colaborador.total_atendimentos != colaborador.total_atendimentos){ return true }
        if (cache_colaborador.total_vendas != colaborador.total_vendas){ return true }
        
    }

    return false

    } catch (e) {
        return true
    }

}