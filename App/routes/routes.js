const express = require("express")
const router = express.Router()



router.get("/", (req, res)=>{
    res.redirect("/Painel")
})

router.get("/Painel", (req, res)=>{
    res.sendFile( __dirname + "/FrontEnd/index.html")
})

module.exports = router