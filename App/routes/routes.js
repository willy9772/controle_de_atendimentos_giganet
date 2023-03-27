const express = require("express")
const router = express.Router()
const { User_Login } = require("./Funções")
const path = require("path")
const multer = require("multer")
const { adicionarAtendimento } = require("../Socket.io/Events/operações")

const upload = multer()


router.get("/", (req, res)=>{
    res.redirect("/Painel")
})

router.get("/Painel", (req, res)=>{
    res.sendFile( __dirname + "/FrontEnd/index.html")
})

router.post("/user/login", (req, res)=>{

    const key = req.body.key

    const result = User_Login(key)

    console.log(result);

    if (!result){
        res.send(false)
        return
    } else {
        res.send(result)
        return
    }

})

router.get("/colaboradores", (req, res)=>{

    res.sendFile(path.join(__dirname, "..", "..", "Server", "Config", "Colaboradores.json"))

})

router.post("/transferir", upload.none() ,(req, res)=>{

    const colaborador = req.body.colaborador
    const tipo = req.body.tipo
    const autor = req.body.autor

    if (!colaborador || !tipo || !autor){
        res.send({message: `Verifique o colaborador e tente novamente!`})
        return
    }

    console.log(`Transferido um atendimento para o colaborador ${colaborador}, com o tipo ${tipo}, transferido por ${autor}`)

    const result = adicionarAtendimento(colaborador, tipo, autor)

})

module.exports = router