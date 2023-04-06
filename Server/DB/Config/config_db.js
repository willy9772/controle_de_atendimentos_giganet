const Sequelize = require('sequelize');
const { Model, DataTypes } = require('sequelize');

module.exports = {start_Database}

async function start_Database() {

    console.log(`Iniciando a Conexão com o Banco de Dados`)

    const sequelize = await new Sequelize('controle_de_atendimentos', 'controle_de_atendimentos', '30392203*', {
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    });

    const Colaboradores = carregar_colaboradoresDb(sequelize)

    await sequelize.sync()
        .then(() => {
            console.log('Tabelas sincronizadas');
        });

    const databases = {
        sequelize: sequelize,
        bds: [Colaboradores]
    }

    module.exports = {databases}

    return databases

}


function carregar_colaboradoresDb(sequelize) {

    class Colaboradores extends Model { }

    Colaboradores.init({

        nome: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: false
        },

        atende: DataTypes.BOOLEAN,
        vende: DataTypes.BOOLEAN,
        setor: DataTypes.STRING,
        entrada_1: DataTypes.CHAR,
        saida_1: DataTypes.CHAR,
        entrada_2: DataTypes.CHAR,
        saida_2: DataTypes.CHAR,
        horario_entrada_sabado: DataTypes.CHAR,
        horario_saida_sabado: DataTypes.CHAR,
        total_atendimentos: DataTypes.INTEGER,
        total_vendas: DataTypes.INTEGER,
        ultimo_atendimento: DataTypes.CHAR,
        ultima_venda: DataTypes.CHAR,
        online: DataTypes.BOOLEAN

    }, {
        sequelize,
        modelName: 'colaboradores',
        timestamps: false
    });

    return Colaboradores


}