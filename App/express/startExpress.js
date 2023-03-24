const express = require("express")
const server = express()
const bodyParser = require("body-parser");
const path = require("path")


function startExpress() {

    // Iniciando Servidor Express

    server.use(express.json());
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))
    server.use(express.static(path.join(__dirname, "..", "routes", "FrontEnd")))

    // Rotas

    const routes = require("../routes/routes")
    server.use('/', routes);

    console.log("Rotas Carregadas com Sucesso!")

    server.listen(3000, () => {
        console.log(`Servidor Sendo Executado com Sucesso!`)
    })
}

module.exports = { startExpress }