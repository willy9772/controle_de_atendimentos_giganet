const { limparAtendimentos } = require("./limparAtendimentos")
const verificarOnlines = require("./verificarOnlines")




function ServerRoutines(){
    
    setInterval(()=>{

        verificarOnlines()
        limparAtendimentos()

    }, 15000)

}


module.exports = ServerRoutines