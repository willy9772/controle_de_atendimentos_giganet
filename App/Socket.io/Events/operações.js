const fs = require("fs")
const path = require("path")
const logsPath = path.join(__dirname, "..", "..", "..", "Server", "Config", "logs.json")


function transferirAtendimento(colaborador, tipo, autor) {


}

function sendSessionkey(socket) {


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
	} catch (e) {
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