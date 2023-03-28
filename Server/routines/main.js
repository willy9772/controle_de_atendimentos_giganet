const verificarOnlines = require("./verificarOnlines")




function ServerRoutines(){
    
    setInterval(()=>{
        verificarOnlines()
    }, 15000)

}


module.exports = ServerRoutines