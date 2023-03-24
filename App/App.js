const bodyParser = require("body-parser")
const express = require("express")
const server = express()




//Express Rotas
server.use(express.static("./routes/FrontEnd"))

const router = require("./routes/routes")
server.use("/", router)

server.use(bodyParser.json()); // processa o corpo da solicitação como JSON
server.use(bodyParser.urlencoded({ extended: true })); // processa o corpo da solicitação como URL-encoded





server.listen(3000, ()=>{
    console.log("Servidor sendo executado na porta 3000")
})