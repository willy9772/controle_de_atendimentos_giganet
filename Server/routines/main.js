const { limparAtendimentos } = require("./limparAtendimentos")
const verificarOnlines = require("./verificarOnlines")




function ServerRoutines(){
    
    setInterval(()=>{

        verificarOnlines()
        limparAtendimentos()

    }, 30000)

}


module.exports = ServerRoutines