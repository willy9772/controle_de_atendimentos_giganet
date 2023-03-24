const express = require("express")
const server = express()




//Express Rotas
server.use(express.static("./routes/FrontEnd"))

const router = require("./routes/routes")
server.use("/", router)

server.use(express.json())





server.listen(3000, ()=>{
    console.log("Servidor sendo executado na porta 3000")
})