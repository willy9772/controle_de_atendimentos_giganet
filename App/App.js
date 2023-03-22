const express = require("express")
const app = express()
const port = 3000
const path = require("path")



const { rotas } = require("./routes/routes")
app.use("/", rotas)



app.listen(port, () => {
    console.log("Servidor sendo executado com sucesso na porta " + port)
})
