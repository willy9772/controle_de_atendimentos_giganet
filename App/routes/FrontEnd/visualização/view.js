const tableBody = document.querySelector("tbody")
const title = document.querySelector("h1")

async function getUpdates() {
    try {

        const response = await fetch("/colaboradores");
        const data = await response.json();
        return data;

    } catch (e) {
        alert(`Erro ao conectar com o Servidor, erro: ${e}`)
    }
}

function getDate() {

    const date = new Date()

    const day = date.getDate().toString().padStart(2, 0)
    const month = (date.getMonth() + 1).toString().padStart(2, 0)
    const year = date.getFullYear().toString()

    return `${day}/${month}/${year}`

};

// Mudar título
(function () {

    title.innerText = `Relatório de Atendimentos dia ${getDate()}`

})();

// Atualizar Tabela

(async function () {

    const colaboradores = await getUpdates()

    colaboradores.forEach(colaborador => {
        gerarTr(colaborador)
    });

})();


function gerarTr(colaborador) {

    const elemento = document.createElement("tr")

    elemento.innerHTML = `
<td>${colaborador.nome}</td>
<td>${colaborador.setor}</td>
<td>${colaborador.total_atendimentos}</td>
<td>${colaborador.total_vendas}</td>
`

    tableBody.appendChild(elemento)

}