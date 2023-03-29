const header = document.querySelector("header")
const login_section = document.querySelector(".userAuth")
const dashboard_section = document.querySelector(".dashboard")
const transferir_section = document.querySelector(".transferir-atendimentos")
const borrar_fundo = document.querySelector(".borrar-fundo")
const config_section = document.querySelector(".config-section")

addListenerTabelas()

/* Funcionamento Geral */

async function getUpdates() {
	const response = await fetch("/colaboradores");
	const data = await response.json();
	return data;
}

/* Login */

login_section.querySelector("form").addEventListener("submit", (form) => {
	form.preventDefault()
	verificarLogin()
})

async function verificarLogin() {

	const passwordInput = document.getElementById("password")
	const password = passwordInput.value

	if (!password) {
		mostrarAviso("O campo não pode estar vazio!")
		return
	}

	const login = await verificarPassKey(password)

	if (!login.status) {
		mostrarAviso("Senha Incorreta, tente novamente")
		return
	}

	function mostrarAviso(aviso) {

		passwordInput.style.borderColor = "var(--cor-terciaria-ligth)"
		login_section.querySelector("label").style.color = "var(--cor-terciaria-ligth)"

		const avisoEl = document.querySelector(".aviso-login")
		avisoEl.style.display = "block"
		avisoEl.innerText = aviso

	}

	async function fecharLogin() {

		login_section.style.opacity = "0"

		await esperarMs(499)

		login_section.style.display = "none"

		carregarDashboard()

	}

	async function verificarPassKey(password) {

		let res = ""

		await fetch('/user/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				key: password
			})
		})
			.then(response => response.json())
			.then(data => res = data)
			.catch(error => console.error(error));

		localStorage.setItem("username", res.nome)

		return res

	}

	fecharLogin()

	inicializarSocket()

}

/* Dashboard */

async function carregarDashboard() {
	dashboard_section.style.display = "flex"
	header.style.display = "flex"

	atualizarUsername()

	const colaboradores = await getUpdates()

	renderVendas(colaboradores)
	renderAtendimentos(colaboradores)

	addListenerTabelas()

}

function criarTrs(objeto, chaves, tableName) {

	const elemento = document.createElement("tr")
	elemento.setAttribute("colaborador", objeto.nome)

	if (tableName) {
		elemento.setAttribute("tableName", tableName)
	}

	if (!arguments[3]) {
		elemento.setAttribute("class", "clickable")
	}


	for (let i = 0; i < chaves.length; i++) {
		const chave = chaves[i];

		elemento.innerHTML += `
        <td>${objeto[chave]}</td>
        `

	}

	return elemento

}

function renderVendas(colaboradores) {

	colaboradores = filtrarPorDataEHora(colaboradores, "ultima_venda")

	const vendedoresTable = dashboard_section.querySelector(".tabela-vendas")
	const vendedoresTBody = vendedoresTable.querySelector("tbody")

	// Limpar Tabela
	vendedoresTBody.innerHTML = ""

	const usuarios = []

	colaboradores.forEach((colaborador) => {

		if (colaborador.online && colaborador.vende) {
			usuarios.push(colaborador)
		}
	})

	usuarios.forEach((user) => {
		const elemento = criarTrs(user, ["nome", "ultima_venda"], "Venda")
		vendedoresTBody.insertAdjacentElement("afterbegin", elemento)
	})

}

function renderAtendimentos(colaboradores) {

	colaboradores = filtrarPorDataEHora(colaboradores, "ultimo_atendimento")

	const atendimentosTable = dashboard_section.querySelector(".tabela-atendimentos")
	const atendimentosTBody = atendimentosTable.querySelector("tbody")

	// Limpar Tabela
	atendimentosTBody.innerHTML = ""

	const users = []

	colaboradores.forEach((colaborador) => {
		if (colaborador.online && colaborador.atende) {
			users.push(colaborador)
		}
	})

	users.forEach((user) => {
		const elemento = criarTrs(user, ["nome", "setor", "ativo_ate", "ultimo_atendimento", "total_atendimentos"], "Atendimento")
		atendimentosTBody.insertAdjacentElement("afterbegin", elemento)
	})
}

function atualizarUsername() {

	const title = document.querySelector("#username-title")
	const username = localStorage.getItem("username")

	title.innerText = `Olá ${username}!`

}

/* Tabela */

function addListenerTabelas() {

	const linhas = document.getElementsByClassName("clickable")

	for (let i = 0; i < linhas.length; i++) {
		const linha = linhas[i];

		linha.addEventListener("click", () => {

			const user = linha.getAttribute("colaborador")
			const tipo = linha.getAttribute("tableName")
			abrir_transferir_atendimento(user, tipo)

		})

	}

}

/* Registrar Atendimentos */
(function () {

	const btnFechar = transferir_section.querySelector("h1")

	btnFechar.addEventListener("click", () => {
		fechar_transferir_atendimento()
	})

})();

/* Transferir Atendimentos */

/* Responsividade */

function abrir_transferir_atendimento(usuario, Tipo) {
	const inputUser = transferir_section.querySelector('input[name="colaborador"]')
	const inputTipo = transferir_section.querySelector('input[name="tipo"]')

	transferir_section.style.display = "flex"
	mostarBorrarFundo(fechar_transferir_atendimento)

	inputUser.value = usuario
	inputTipo.value = Tipo


}

function fechar_transferir_atendimento() {
	transferir_section.style.display = "none"
	esconderBorrarFundo()
}

/* Borrar Fundo */

function mostarBorrarFundo(cb) {
	borrar_fundo.style.pointerEvents = "auto"
	borrar_fundo.style.display = "block"
	borrar_fundo.style.opacity = "1"

	borrar_fundo.addEventListener("click", () => {
		cb()
	})
}

function esconderBorrarFundo() {
	borrar_fundo.style.opacity = "0"
	borrar_fundo.style.pointerEvents = "none"
	borrar_fundo.style.display = "none"
}

/* Funções Extras */

async function esperarMs(ms) {
	const timer = new Promise((resolve, reject) => {

		if (isNaN(ms)) {
			reject(false)
		}

		setTimeout(() => {
			resolve(true)
		}, ms)
	})

	return await timer
}

function filtrarHorarios(objeto, chave) {

	objeto.sort(function (a, b) {

		// Extrai as horas e minutos de cada horário
		const [horasA, minutosA] = a[chave].split(":");
		const [horasB, minutosB] = b[chave].split(":");

		// Compara as horas e, se forem iguais, compara os minutos
		if (horasA < horasB) {
			return -1;
		} else if (horasA > horasB) {
			return 1;
		} else {
			if (minutosA < minutosB) {
				return -1;
			} else if (minutosA > minutosB) {
				return 1;
			} else {
				return 0;
			}
		}
	});

	return objeto.reverse()

}

function filtrarPorData(objeto, chave) {

	// Função para converter as datas no formato "dd/mm/aaaa" em objetos Date
	function toDate(dateStr) {
		const [day, month, year] = dateStr.split(/[\/]/);
		return new Date(year, month - 1, day);
	}

	// Função de comparação para ordenar por data de último atendimento
	function compareLastAtendimento(a, b) {
		const dateA = toDate(a[chave]);
		const dateB = toDate(b[chave]);

		if (dateA < dateB) {
			return -1;
		} else if (dateA > dateB) {
			return 1;
		} else {
			return 0;
		}
	}

	// Ordena o objeto usando a função de comparação personalizada
	objeto.sort(compareLastAtendimento);

	return objeto

}

function filtrarPorDataEHora(objeto, chave) {

	const resultado = objeto.sort(compararAeB)

	function compararAeB(a, b) {

		const dataA = new Date(Date.parse(a[chave].replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/, "$2/$1/$3 $4:$5")));
		const dataB = new Date(Date.parse(b[chave].replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/, "$2/$1/$3 $4:$5")));

		return dataB - dataA;

	}

	return resultado

}



// Iniciar Socket

/* Socket IO */

function inicializarSocket() {

	const socket = io(`http://${window.location.hostname}:3500`);

	socket.on('connect', () => {
		console.log('Conectado ao servidor com sucesso');
	});

	socket.on("atualizar dashboard", (data) => {
		carregarDashboard(data.data)
	});

	// Formulário para Transferir Atendimentos
	(function () {
		const form = document.getElementById("transferir-atendimento")

		form.addEventListener("submit", (evt) => {

			evt.preventDefault()

			const colaboradorInput = document.getElementById("colaborador").value
			const tipoInput = document.getElementById("tipo").value
			const autor = localStorage.getItem("username")

			const data = {
				colaborador: colaboradorInput,
				tipo: tipoInput,
				autor: autor
			}

			socket.emit("transferir atendimento", data)

			fechar_transferir_atendimento()

		})
	})();

	// Atualizar o Arquivo de configurações
	(function (){

		const btn = document.getElementById("salvar-config")
	
		btn.addEventListener("click", salvarConfig)
		
		function salvarConfig(){
	
			let colaboradores = []
	
			const Trs = document.querySelectorAll("#config-tbody tr")
	
			Trs.forEach((tr)=>{
	
				const Tds = tr.querySelectorAll("td")
	
				colaboradores.push({
	
					nome: Tds[0].querySelector("input").value,
					vende: Tds[1].querySelector("input").checked,
					atende: Tds[2].querySelector("input").checked,
					setor: Tds[3].querySelector("input").value,
					entrada_1: Tds[4].querySelector("input").value,
					saida_1: Tds[5].querySelector("input").value,
					entrada_2: Tds[6].querySelector("input").value,
					saida_2: Tds[7].querySelector("input").value,
					horario_sabado_entrada: Tds[8].querySelector("input").value,
					horario_sabado_saida: Tds[9].querySelector("input").value,
	
				})
	
			})
	
			socket.emit("update colaboradores", colaboradores)

		}
	
	
	})();

	(function(){

		socket.on("new sessionKey", (res)=>{

			console.log(`Cadastrada Chave da sessão: ${res}`);

			localStorage.setItem("sessionKey", res)

		})

	})();


};


/* Tabela Configurações */

// Listener Abrir Config

(function () {
	header.querySelector("#btn-open-settings").addEventListener("click", abrirConfiguracoes)
})()

function abrirConfiguracoes() {

	config_section.style.display = "flex"
	mostarBorrarFundo(fecharConfiguracoes)
	atualizarConfigTable()

}

function fecharConfiguracoes() {
	config_section.style.display = "none"
	esconderBorrarFundo()
}

function gerarConfigTr(colaborador) {

	const newTr = document.createElement("tr")

	newTr.innerHTML = `
<td tdName="nome"><input type="text" class="mdsgn-text-input" value="${colaborador.nome}"></td>
<td tdName="vende">
    <div class="custom-checkbox">
        <input class="table-checkbox" type="checkbox" ${colaborador.vende ? "checked" : ""}>
        <span class="checkmark"></span>
    </div>
</td>
<td tdName="atende" >
    <div class="custom-checkbox">
        <input class="table-checkbox" type="checkbox" ${colaborador.atende ? "checked" : ""}>
        <span class="checkmark"></span>
    </div>
</td>
<td> <input tdName="setor" type="text" class="mdsgn-text-input" value="${colaborador.setor}"> </td>
<td> <input tdName="entrada_1" type="text" class="mdsgn-text-input input-hour" value="${colaborador.entrada_1}"> </td>
<td> <input tdName="saida_1" type="text" class="mdsgn-text-input input-hour" value="${colaborador.saida_1}"> </td>
<td> <input tdName="entrada_2" type="text" class="mdsgn-text-input input-hour" value="${colaborador.entrada_2}"> </td>
<td> <input tdName="saida_2" type="text" class="mdsgn-text-input input-hour" value="${colaborador.saida_2}""> </td>
<td class="border-left" tdName="horario_sabado_entrada" >  <input type="text" class="mdsgn-text-input input-hour" value="${colaborador.horario_sabado_entrada}"> </td>
<td> <input type="text" tdName="horario_sabado_saida" class="mdsgn-text-input input-hour" value="${colaborador.horario_sabado_saida}"> </td>

`
	return newTr

}

async function atualizarConfigTable() {

	const tBody = document.getElementById("config-tbody")

	tBody.innerHTML = ""

	const colaboradores = await getUpdates()

	colaboradores.forEach((colaborador) => {

		const elemento = gerarConfigTr(colaborador)

		tBody.insertAdjacentElement("beforeend", elemento)

	})

	addListenerInputsHora()

}

// Verificar os Inputs de Hora das configs

function addListenerInputsHora() {

	const inputsHora = document.querySelectorAll(".input-hour")

	inputsHora.forEach((input) => {
		input.addEventListener("keydown", (event) => {

			verificarHoraValida(input, event)

			if (!/[0-9:]/.test(event.key) && event.key !== "ArrowLeft" && event.jey !== "Tab" && event.key !== "ArrowRight" && event.key !== "Backspace") {
				event.preventDefault();
			}

		})
	})


}

function verificarHoraValida(input, event) {

	// Formata a entrada para o formato hh:mm
	if (/[0-9]/.test(event.key) && input.value.length < 5) {
		if (input.value.length === 2 && !input.value.includes(":")) {
			input.value += ":";
		}
		if (input.value.length === 2 && input.value.includes(":")) {
			input.value += event.key;
			event.preventDefault();
		}
		if (input.value.length === 1 && event.key === "0") {
			input.value += event.key + ":";
			event.preventDefault();
		}
		if (input.value.length === 4 && !input.value.includes(":")) {
			input.value = input.value.slice(0, 2) + ":" + input.value.slice(2, 4);
		}
	}

	if (input.value.length >= 5 && event.key != "Backspace") {
		event.preventDefault()
	}

}
