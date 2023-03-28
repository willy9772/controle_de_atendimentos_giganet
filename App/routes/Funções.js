const fs = require("fs");
const path = require("path");




function User_Login(password) {

    if (!password) {
        return {
            message: "Digite uma Senha Válida!",
            status: false
        }
    }

    const usuarios = JSON.parse(fs.readFileSync(path.join("..", "Server", "Config", "Acessos.json")))

    let resultado = {
        status: false,
        message: "Chave Inválida! Tente Novamente"
    }

    usuarios.forEach(user => {

        if (user.chave == password) {
            resultado = {
                status: true,
                message: "Logado com sucesso!",
                nome: user.nome,
                data: getCurrentDate(),
                hora: getCurrentHour(),
                sessionKey: generateRandomString()
            }
        }
    });

    return resultado

}

function generateRandomString(length) {

    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function getCurrentHour() {

    const date = new Date

    const hour = date.getHours().toString().padStart(2, "0")
    const minute = date.getMinutes().toString().padStart(2, "0")

    return `${hour}:${minute}`

}

function getCurrentDate() {

    const date = new Date

    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, 0)
    const year = date.getFullYear().toString()

    return `${day}/${month}/${year}`

}

module.exports = { User_Login }