const fs = require("fs")
const { type } = require("os")
const path = require("path")

const colaboradoresPath = path.join(__dirname, "..", "..", "..", "Server", "Config", "Colaboradores.json")
const logsPath = path.join(__dirname, "..", "..", "..", "Server", "Config", "logs.json")


function transferirAtendimento(colaborador, tipo, autor) {

	console.log(`Transferido um atendimento para o colaborador ${colaborador}, com o tipo ${tipo}, transferido por ${autor}`)

	const colaboradores = JSON.parse(fs.readFileSync(colaboradoresPath))

	const user = colaboradores.find(obj => obj.nome == colaborador)

	if (tipo == "Atendimento") {
		user.ultimo_atendimento = `${getCurrentDate()} ${getCurrentHour()}`
		user.total_atendimentos++
	} else if (tipo == "Venda") {
		user.ultima_venda = `${getCurrentDate()} ${getCurrentHour()}`
		if (!user.total_vendas) {
			user.total_vendas = 0
		} else {
			user.total_vendas++
		}
	}

	fs.writeFileSync(colaboradoresPath, JSON.stringify(colaboradores))

registrarNosLogs({
	dia: getCurrentDate(),
	hora: getCurrentHour(),
	operação: "Transferir Atendimento de " + tipo,
	autor: autor
})

}

function sendSessionkey(socket) {

	const sessionKey = socket.id

	socket.emit("new sessionKey", sessionKey)

	console.log(`Enviado chave da sessão ${socket.id}`);




	socket.on("disconnect", (user) => {
		console.log(`O Socket ID ${socket.id} se desconectou`);
	})

}


module.exports = { transferirAtendimento, sendSessionkey }


function getCurrentHour() {

	const date = new Date

	const hour = date.getHours().toString().padStart(2, "0")
	const minute = date.getMinutes().toString().padStart(2, "0")

	return `${hour}:${minute}`

}

function getCurrentDate() {

	const date = new Date

	const day = date.getDate().toString().padStart(2, "0")
	const month = (date.getMonth() + 1).toString().padStart(2, 0)
	const year = date.getFullYear().toString()

	return `${day}/${month}/${year}`

}

function registrarNosLogs(obj) {

	let logsFile

	try {
		logsFile = JSON.parse(fs.readFileSync(logsPath))
	} catch (e){
		logsFile = fs.readFileSync(logsPath)
	}

	if (typeof logsFile != "Array") { logsFile = [] }

	if (typeof obj == "object") {
		logsFile.push(obj)
	} else {
		return
	}

	fs.writeFileSync(logsPath, JSON.stringify(logsFile))

}