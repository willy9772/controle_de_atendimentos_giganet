const fs = require("fs")


function User_Login(password){

    if (!password){
        return {message: "Senha Inválida!"}
    }

    const users = JSON.parse(fs.readFileSync("../../Server/Config/Acessos.json"))

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        if (user[i].chave === password){

            const response = {
                nome: user[i].nome,
                key: generateRandomString(),
                data: buscarData(),
                hora: buscarHora()
            }

            return response

        }
        
    }


}


function generateRandomString(){

    function generateRandomString(length) {
        let result = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      }      

}

function buscarData(){

    const date = new Date()

    const day = date.getDay()
    const month = date.getMonth - 1
    const year = date.getFullYear()

    return `${day}/${month}/${year}`

}

function buscarHora(){

    const date = new Date()


const hour = date.getHours()
const min = date.getMinutes()

return `${hour}:${min}`

}

module.exports = { User_Login }