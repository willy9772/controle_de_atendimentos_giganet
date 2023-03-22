const { Router } = require("express");
const rotas = Router()



rotas.get("/", (req, res) => {
    res.redirect("./painel")
})

rotas.get("/painel", (req, res)=>{
    res.sendFile()
})









module.exports = { rotas }