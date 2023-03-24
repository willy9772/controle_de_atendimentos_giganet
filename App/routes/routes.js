const express = require("express")
const router = express.Router()
const { User_Login } = require("./Funções")
const path = require("path")



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

module.exports = router