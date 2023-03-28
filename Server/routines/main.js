const verificarOnlines = require("./verificarOnlines")




function ServerRoutines(){
    
    setInterval(()=>{
        verificarOnlines()
    }, 60000)

}


module.exports = ServerRoutines