const header = document.querySelector("header")
const login_section = document.querySelector(".userAuth")
const dashboard_section = document.querySelector(".dashboard")
const transferir_section = document.querySelector(".transferir-atendimentos")
const borrar_fundo = document.querySelector(".borrar-fundo")

addListenerTabelas()

/* Funcionamento Geral */

async function getUpdates() { 
    const response = await fetch("/colaboradores");
    const data = await response.json();
    return data;
  }

/* Login */

login_section.querySelector("form").addEventListener("submit", (form)=>{
    form.preventDefault()
    verificarLogin()
})

async function verificarLogin(){

    const passwordInput = document.getElementById("password")
    const password = passwordInput.value

    if (!password) {
        mostrarAviso("O campo não pode estar vazio!")
        return
    }

    const login = await verificarPassKey(password)

    if(!login.status) {
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

    async function fecharLogin(){
        
        login_section.style.opacity = "0"
        
        await esperarMs(499)

        login_section.style.display = "none"

        carregarDashboard()

    }

    async function verificarPassKey(password){

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

async function carregarDashboard(){
    dashboard_section.style.display = "flex"
    header.style.display = "flex"

    atualizarUsername()

    const colaboradores = await getUpdates()

    renderVendas(colaboradores)
    renderAtendimentos(colaboradores)
    renderOnlines(colaboradores)

    addListenerTabelas()

}

function criarTrs(objeto, chaves, tableName){

    const elemento = document.createElement("tr")
    elemento.setAttribute("colaborador", objeto.nome)

    if (tableName){
        elemento.setAttribute("tableName", tableName)
    }

    if (!arguments[3]){
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

function renderVendas(colaboradores){

    colaboradores = filtrarPorData(colaboradores, "ultima_venda")
    
    const vendedoresTable = dashboard_section.querySelector(".tabela-vendas")
    const vendedoresTBody = vendedoresTable.querySelector("tbody")

    const usuarios = []

    colaboradores.forEach((colaborador)=>{

        if (colaborador.online && colaborador.vende){
            usuarios.push(colaborador)
        }
    })
    
    usuarios.forEach((user)=>{
        const elemento = criarTrs(user, ["nome", "ultima_venda"], "Venda")
        vendedoresTBody.insertAdjacentElement("afterbegin", elemento)
    })

}

function renderAtendimentos(colaboradores){

    colaboradores = filtrarPorData(colaboradores, "ultimo_atendimento")

    const atendimentosTable = dashboard_section.querySelector(".tabela-atendimentos")
    const atendimentosTBody = atendimentosTable.querySelector("tbody")

    const users = []

    colaboradores.forEach((colaborador)=>{
        if (colaborador.online && colaborador.atende){
            users.push(colaborador)
        }
    })

    users.forEach((user)=>{
        const elemento = criarTrs(user, ["nome", "setor", "ultimo_atendimento", "total_atendimentos"], "Atendimento")
        atendimentosTBody.insertAdjacentElement("afterbegin", elemento)
    })
}

function renderOnlines(colaboradores){

    colaboradores = filtrarHorarios(colaboradores, "ativo_ate")

    const onlinesTable = dashboard_section.querySelector(".tabela-onlines")
    const onlinesTBody = onlinesTable.querySelector("tbody")

    const users = []

    colaboradores.forEach((colaborador)=>{
        if (colaborador.online){
            users.push(colaborador)
        }
    })

    users.forEach((user)=>{
        const elemento = criarTrs(user, ["nome", "ativo_ate"], "", true)
        onlinesTBody.insertAdjacentElement("afterbegin", elemento)
    })
}

function atualizarUsername(){

    console.log(`Atualizando Username`);

    const title = document.querySelector("#username-title")
    const username = localStorage.getItem("username")

    title.innerText = `Olá ${username}!`

}

/* Tabela */

function addListenerTabelas (){

    const linhas = document.getElementsByClassName("clickable")

    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];

        linha.addEventListener("click", ()=>{
            
            const user = linha.getAttribute("colaborador")
            const tipo = linha.getAttribute("tableName")
            abrir_transferir_atendimento(user, tipo)

        })
        
    }

}

/* Registrar Atendimentos */
(function(){

    const btnFechar = transferir_section.querySelector("h1")

    btnFechar.addEventListener("click", ()=>{
        fechar_transferir_atendimento()
    })

})()

/* Transferir Atendimentos */

function abrir_transferir_atendimento(usuario, Tipo){
    const inputUser = transferir_section.querySelector('input[name="colaborador"]')
    const inputTipo = transferir_section.querySelector('input[name="tipo"]')

    transferir_section.style.display = "flex"
    mostarBorrarFundo(fechar_transferir_atendimento)

    inputUser.value = usuario
    inputTipo.value = Tipo


}

function fechar_transferir_atendimento(){
    transferir_section.style.display = "none"
    esconderBorrarFundo()
}

/* Borrar Fundo */

function mostarBorrarFundo(cb){
    borrar_fundo.style.pointerEvents = "auto"
    borrar_fundo.style.display = "block"
    borrar_fundo.style.opacity = "1"

    borrar_fundo.addEventListener("click", ()=>{
        cb()
    })
}

function esconderBorrarFundo(){
    borrar_fundo.style.opacity = "0"
    borrar_fundo.style.pointerEvents = "none"
    setTimeout(()=>{
        borrar_fundo.style.display = "none"
    }, 500)
}

/* Funções Extras */

async function esperarMs(ms){
    const timer = new Promise((resolve, reject) => {

        if (isNaN(ms)){
            reject(false)
        }

        setTimeout(()=>{
            resolve(true)
        }, ms)
    })

    return await timer
}

function filtrarHorarios(objeto, chave){

    objeto.sort(function(a, b) {

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
      
      console.log(objeto);

      return objeto.reverse()

}

function filtrarPorData(objeto, chave){

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




/* Socket IO */

function inicializarSocket(){
    
    const socket = io("http://10.20.30.12:3500");

    socket.on('connect', () => {
      console.log('Conectado ao servidor');
    });
    
    return socket

}