const verificarOnlines = require("../../../Server/routines/verificarOnlines");
const { sendSessionkey } = require("./operações")


function emitirEventos(io, DB) {

    colaboradores_Db = DB.bds[0]

    setInterval(async () => {

        const arquivo = await colaboradores_Db.findAll({})

        // Enviar atualização à Dashboard
        console.log(`Arquivo Colaboradores atualizado e emitido ao FrontEnd`)

        io.emit("atualizar dashboard", {
            data: arquivo
        })

    }, 2500)


}

function escutarEventos(io, DB) {

    console.log(`Escutando Eventos`);

    sendSessionkey(io)

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