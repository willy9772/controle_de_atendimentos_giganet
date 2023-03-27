const { Socket } = require("socket.io");




function escutarEventos(io){

    io.on("atendimento transferido", (evento)=>{

        console.log(evento)



    })





}