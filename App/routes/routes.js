const express = require("express")
const router = express.Router()
const { User_Login } = require("./Funções")
const path = require("path")
const { databases } = require("../../Server/DB/Config/config_db")

router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})

router.get("/", (req, res) => {
    res.redirect(`/geral`)
})

router.get("/geral", (req, res) => {
    res.sendFile(__dirname + "/FrontEnd/visualização/visualizacao.html")
})

router.get("/Painel", (req, res) => {
    res.sendFile(__dirname + "/FrontEnd/index.html")
})

router.post("/user/login", (req, res) => {

    const key = req.body.key

    const result = User_Login(key)

    if (!result) {
        res.send(false)
        return
    } else {
        res.send(result)
        return
    }

})

router.get("/colaboradores", async (req, res) => {

    const colaboradores_db = databases.bds[0]
    const consulta = await colaboradores_db.findAll({})

    res.send(consulta)

})

module.exports = router