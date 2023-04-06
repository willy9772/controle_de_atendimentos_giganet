const { limparAtendimentos } = require("./limparAtendimentos")
const verificarOnlines = require("./verificarOnlines")




function ServerRoutines(){
    
    setInterval(()=>{

        verificarOnlines()
        limparAtendimentos()

    }, 25000)

}


module.exports = ServerRoutines