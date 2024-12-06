/*
const tarefasPorDia = {
    1: ["Tarefa 1", "Tarefa 2"], // Dia 1 com duas tarefas
    2: ["Tarefa 3"],             // Dia 2 com uma tarefa
    3: []                        // Dia 3 sem tarefas
};
*/

// objeto para armazenar as tarefas por dia
const tarefasPorDia = {};

// mapeando os elementos do html que serao manipulados e alterados
const calendario = document.getElementById('calendario');
const modal = document.getElementById('modal');
const modalTitulo = document.getElementById('modalTitulo');
const listaTarefas = document.getElementById('listaTarefas');
const novaTarefaInput = document.getElementById('novaTarefa');
const adicionarTarefaBtn = document.getElementById('adicionarTarefa');
const fecharModalBtn = document.getElementById('fecharModal');
const toggleTemaBtn = document.getElementById('toggleTema');

let diaSelecionado = null;

// funçao para criar o calendario
function criarCalendario() {
    for (let dia = 1; dia <= 31; dia++){
        const quadrado = document.createElement('div');
        quadrado.classList.add('dia');
        quadrado.textContent = dia;

        // adiciona um contador para tarefas
        const contadorTarefas = document.createElement('span');
        contadorTarefas.classList.add('contador-tarefas');
        contadorTarefas.textContent = '0';
        quadrado.appendChild(contadorTarefas);

        // atualiza o visual do quadrado com base nos dados carregados
        const quantidadeTarefas = (tarefasPorDia[dia] || []).length;
        atualizarVisualizacaoDia(quadrado, quantidadeTarefas);

        // evento de click para abrir o modal
        quadrado.addEventListener('click', () => abrirModal(dia, quadrado));

        calendario.appendChild(quadrado);
    }
}

// funçao para abrir o modal
function abrirModal(dia, quadrado){
    diaSelecionado = dia;
    modal.classList.add('active');
    modalTitulo.textContent = `Compromissos do Dia ${dia}`;
    atualizarListaTarefas(quadrado);
}

// funçao para fechar o modal
function fecharModal() {
    modal.classList.remove('active');
    novaTarefaInput.value = '';
}

function atualizarListaTarefas(quadrado){
    listaTarefas.innerHTML = ''; // limpa a lista
    const tarefas = tarefasPorDia[diaSelecionado] || []; // obtem as tarefas do dia
    tarefas.forEach((tarefa, index) => { // para cada tarefa, cria um item na lista
        const item = document.createElement('li');
        item.textContent = tarefa;

        // botao para remover a tarefa
        const botaoRemover = document.createElement('button');
        botaoRemover.textContent = 'Remover';
        botaoRemover.style.marginLeft = '10px';
        botaoRemover.addEventListener('click', () => {
            removerTarefa(index, quadrado);
        });

        item.appendChild(botaoRemover);
        listaTarefas.appendChild(item);
    });
    atualizarVisualizacaoDia(quadrado, tarefas.length);
}

// funçao para adicionar uma nova tarefa
function adicionarTarefa() {
    const novaTarefa = novaTarefaInput.value.trim();
    if(!novaTarefa){
        alert('Por favor, insira uma nova tarefa.');
        return;
    }
    if(!tarefasPorDia[diaSelecionado]){
        tarefasPorDia[diaSelecionado] = []; 
        // inicializaçao do array caso nao tenha nenhuma tarefa no dia
    }
    tarefasPorDia[diaSelecionado].push(novaTarefa); // add tarefa array
    novaTarefaInput.value = '';
    const quadrado = document.querySelector(`.dia:nth-child(${diaSelecionado})`);
    atualizarListaTarefas(quadrado);
    salvarDados();
}

function removerTarefa(index, quadrado) {
    tarefasPorDia[diaSelecionado].splice(index, 1);
    atualizarListaTarefas(quadrado);
    salvarDados(); // salva os dados após remover
}

// funçao para atualizar a visualizaçao do dia no calendario
function atualizarVisualizacaoDia(quadrado, quantidadeTarefas) {
    const contador = quadrado.querySelector('.contador-tarefas');
    contador.textContent = quantidadeTarefas;

    if(quantidadeTarefas > 0){
        quadrado.classList.add('comTarefa');
    } else {
        quadrado.classList.remove('comTarefa');
    }
}

// funçao para salvar os dados no localStorage
function salvarDados() {
    localStorage.setItem('tarefas', JSON.stringify(tarefasPorDia));
}
// funçao para carregar os dados do localStorage
function carregarDados() {
    const dadosSalvos = localStorage.getItem('tarefas');
    if (dadosSalvos) {
        Object.assign(tarefasPorDia, JSON.parse(dadosSalvos));
        // atualizar o objeto (conjunto de arrays dos dias) com os dados salvos
    }
    // atualizar o visual do calendario com as tarefas que foram carregadas do arquivo
    const dias = document.querySelectorAll('.dia');
    dias.forEach((quadrado, index) => {
        const dia = index + 1; // os dias do calendario começam no 1 e o index no zero
        const quantidadeTarefas = (tarefasPorDia[dia] || []).length;
        atualizarVisualizacaoDia(quadrado, quantidadeTarefas); // atualiza o visual do dia
    });
}

function alternarTema() {
    document.body.classList.toggle('tema-escuro'); // alterna a classe

    // salvar o tema atual no localStorage
    const temaAtual = document.body.classList.contains('tema-escuro') ? 'escuro' : 'claro';
    localStorage.setItem('tema', temaAtual);
}

// evento de clique no botao de alternancia do tema
toggleTemaBtn.addEventListener('click', alternarTema);

function carregarTema() {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'escuro'){
        document.body.classList.add('tema-escuro');
    }
}

adicionarTarefaBtn.addEventListener('click', adicionarTarefa);
fecharModalBtn.addEventListener('click', fecharModal);

document.getElementById('limparDados').addEventListener('click', () => {
    localStorage.clear(); // apaga todas as infos do local storage
    location.reload(); // recarregar a pagina para atualizar o estado
    alert('Todos dos dados foram apagados');
});

// inicializaçao das funções
carregarDados();
carregarTema();
criarCalendario();