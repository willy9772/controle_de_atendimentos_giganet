const fs = require("fs");
const path = require("path");




    function User_Login(password){
    
        if (!password) {return {
            message: "Digite uma Senha Válida!",
            status: false
        }}
    
        const usuarios = JSON.parse(fs.readFileSync(path.join("..", "Server", "Config", "Acessos.json")))
    
        let resultado =  {
            status: false,
            message: "Chave Inválida! Tente Novamente"
        }
    
        usuarios.forEach(user => {
           
            if (user.chave == password){
                resultado = {
                    status: true,
                    message: "Logado com sucesso!",
                    nome: user.nome,
                    data: buscarData(),
                    hora: buscarHora(),
                    sessionKey: generateRandomString()
                } 
            }
        });
    
        return resultado
    
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