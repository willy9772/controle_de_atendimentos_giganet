const express = require("express")
const router = express.Router()
const { User_Login } = require("./Funções")



router.get("/", (req, res)=>{
    res.redirect("/Painel")
})

router.get("/Painel", (req, res)=>{
    res.sendFile( __dirname + "/FrontEnd/index.html")
})

router.post("/user/login", (req, res)=>{

    console.log(req.body)

    const key = req.body.key

    const result = User_Login(key)

    if (!result){
        res(false)
    } else {
        res(result)
    }

})


module.exports = router