const { limparAtendimentos } = require("./limparAtendimentos")
const verificarOnlines = require("./verificarOnlines")




function ServerRoutines(){
    
    setInterval(()=>{

        verificarOnlines()
        limparAtendimentos()

<<<<<<< HEAD
    }, 15000)
=======
    }, 30000)
>>>>>>> 84a7f91ac159fd0d4b9b8cdcb8cce7e682f9ffb8

}


module.exports = ServerRoutines