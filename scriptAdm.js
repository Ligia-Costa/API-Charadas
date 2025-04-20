// Configuração inicial e constantes globais

// URL's da nossa API (Backend)

const ENDPOINT_CHARADAS = 'https://charadas-api-livid.vercel.app/charadas';
const ENDPOINT_LISTA_TODAS = 'https://charadas-api-livid.vercel.app/charadas/lista';

// Ligando com os elementos HTML

// Ligando os formulários

// Formulário de criação
let formularioCriacao = document.getElementById('create-form');
let inputPerguntaCriacao = document.getElementById('create-name');
let inputRespostaCriacao = document.getElementById('create-description');

// Formulário de Atualização (edição)
let formularioAtualizacao = document.getElementById('update-form');
let inputAtualizacaoId = document.getElementById('update-id');
let inputPerguntaAtualizacao = document.getElementById('update-name');
let inputRespostaAtualizacao = document.getElementById('update-description');
let botaoCancelarAtualizacao = document.getElementById('cancel-update');

// Lista (elementos <div>) onde as charadas serão exibidas
let listaCharadasElemento = document.getElementById('item-list');

// ===========================================================
// FUNÇÕES PARA INTERAGIR COM API 
// ===========================================================

// READ (Listar as charadas no elemento lista)

async function buscarListarCharadas() {
    console.log("Buscando charadas na API....");
    listaCharadasElemento.innerHTML = '<p>Carregando charadas...</p>';

    try {
        const respostaHttp = await fetch(ENDPOINT_LISTA_TODAS);

        if(!respostaHttp){
            throw new Error(`Erro na API: ${respostaHttp.status} ${respostaHttp.statusText}`);
        }

        const charadas = await respostaHttp.json();

        console.log("Charadas recebidas: ",charadas)
        
        exibirCharadasNaTela(charadas);

    } catch (erro) {
        console.error(`Falha ao buscar charadas: ${erro}`);
        listaCharadasElemento.innerHTML = `
        <p style="color: red;">Erro ao carregar charadas: ${erro.message}</p>`
    }
}

// --- CREATE (Criar uma nova charada) ---
async function criarCharada(evento) {
    evento.preventDefault(); // Previne o comportamento padrão do formulário (que é recarregar a página)
    console.log("Tentando criar nova charada...");

    const pergunta = inputPerguntaCriacao.value;
    const respostaCharada = inputRespostaCriacao.value;

    if (!pergunta || !respostaCharada) {
        alert("Por favor, preencha a pergunta e a resposta.");
        return;
    }

    const novaCharada = {
        pergunta: pergunta,
        resposta: respostaCharada
    };

    try {
        const respostaHttp = await fetch(ENDPOINT_CHARADAS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novaCharada)
        });

        const resultadoApi = await respostaHttp.json();

        if (!respostaHttp.ok) {
            throw new Error(resultadoApi.mensagem || `Erro ao criar charada: ${respostaHttp.status}`);
        }

        console.log("Charada criada com sucesso!", resultadoApi);
        alert(resultadoApi.mensagem);

        inputPerguntaCriacao.value = '';
        inputRespostaCriacao.value = '';

        await buscarListarCharadas();

    } catch (erro) {
        console.error("Falha ao criar charada:", erro);
        alert(`Erro ao criar charada: ${erro.message}`);
    }
}

// --- UPDATE (Atualizar uma charada existente) ---
async function atualizarCharada(evento) {
    evento.preventDefault();
    console.log("Tentando atualizar charada...");

    const id = inputAtualizacaoId.value;
    const pergunta = inputPerguntaAtualizacao.value;
    const respostaCharada = inputRespostaAtualizacao.value;

    const dadosCharadaAtualizada = {
        pergunta: pergunta,
        resposta: respostaCharada
    };

    if (!id) {
        console.error("ID da charada para atualização não encontrado!");
        alert("Erro interno: ID da charada não encontrado para atualizar.");
        return;
    }

    if (!pergunta || !respostaCharada) {
        alert("Por favor, preencha a pergunta e a resposta para atualizar.");
        return;
    }

    try {
        const respostaHttp = await fetch(`${ENDPOINT_CHARADAS}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosCharadaAtualizada)
        });

        const resultadoApi = await respostaHttp.json();

        if (!respostaHttp.ok) {
            throw new Error(resultadoApi.mensagem || `Erro ao atualizar charada: ${respostaHttp.status}`);
        }

        console.log("Charada atualizada com sucesso! ID:", id);
        alert(resultadoApi.mensagem);

        esconderFormularioAtualizacao();
        await buscarListarCharadas();

    } catch (erro) {
        console.error("Falha ao atualizar charada:", erro);
        alert(`Erro ao atualizar charada: ${erro.message}`);
    }
}

// --- DELETE (Excluir uma charada) ---
async function excluirCharada(id) {
    console.log(`Tentando excluir charada com ID: ${id}`);

    if (!confirm(`Tem certeza que deseja excluir a charada com ID ${id}? Esta ação não pode ser desfeita.`)) {
        console.log("Exclusão cancelada pelo usuário.");
        return;
    }

    try {
        const respostaHttp = await fetch(`${ENDPOINT_CHARADAS}/${id}`, {
            method: 'DELETE'
        });

        const resultadoApi = await respostaHttp.json();

        if (!respostaHttp.ok) {
            throw new Error(resultadoApi.mensagem || `Erro ao excluir charada: ${respostaHttp.status}`);
        }

        console.log("Charada excluída com sucesso!", id);
        alert(resultadoApi.mensagem);

        await buscarListarCharadas();

    } catch (erro) {
        console.error("Falha ao excluir charada:", erro);
        alert(`Erro ao excluir charada: ${erro.message}`);
    }
}

// ============================================================
// FUNÇÕES PARA MANIPULAR O HTML (Atualizar a Página)
// ============================================================

// --- Mostrar as charadas na lista ---
function exibirCharadasNaTela(lista) {
  const elementoLista = document.getElementById('item-list');
  elementoLista.innerHTML = '';

  lista.forEach(function (charada) {
    const divCharada = document.createElement('div');
    divCharada.classList.add('mb-6', 'pb-4', 'border-b');

    divCharada.innerHTML = `
      <p class="text-lg font-semibold">Pergunta: <span class="font-normal">${charada.pergunta}</span></p>
      <p class="text-lg font-semibold">Resposta: <span class="font-normal">${charada.resposta}</span></p>
      <p class="text-sm text-gray-600 mt-1">ID: ${charada.id}</p>
      <div class="mt-2 flex gap-2">
        <button class="btn-editar bg-orange-300 hover:bg-orange-400 px-3 py-1 rounded flex items-center gap-1">
  <i data-lucide="edit" class="w-4 h-4"></i> Editar
      </button>
        <button onclick="excluirCharada(${charada.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"><i data-lucide="trash-2" class="w-4 h-4"></i>  
          Excluir
        </button>
      </div>
    `;
    const botaoEditar = divCharada.querySelector('.btn-editar');
  botaoEditar.addEventListener('click', function () {
  exibirFormularioAtualizacao(charada.id, charada.pergunta, charada.resposta);
});

    lucide.createIcons();

    elementoLista.appendChild(divCharada);
  });
}

// --- Mostrar o formulário de atualização (edição) ---
function exibirFormularioAtualizacao(id, pergunta, resposta) {
    console.log("Mostrando formulário de atualização para a charada ID:", id);
    inputAtualizacaoId.value = id;
    inputPerguntaAtualizacao.value = pergunta;
    inputRespostaAtualizacao.value = resposta;

    formularioAtualizacao.classList.remove('hidden');
    formularioCriacao.classList.add('hidden');

    formularioAtualizacao.scrollIntoView({ behavior: 'smooth' });
}

// --- Esconder o formulário de atualização ---
function esconderFormularioAtualizacao() {
    console.log("Escondendo formulário de atualização.");
    formularioAtualizacao.classList.add('hidden');
    formularioCriacao.classList.remove('hidden');

    inputAtualizacaoId.value = '';
    inputPerguntaAtualizacao.value = '';
    inputRespostaAtualizacao.value = '';
}


// ==============================================================
// EVENT LISTENERS GLOBAIS (Campainhas principais da página)
// ==============================================================

formularioCriacao.addEventListener('submit',criarCharada);
formularioAtualizacao.addEventListener('submit', atualizarCharada);
botaoCancelarAtualizacao.addEventListener('click', esconderFormularioAtualizacao);

// INICIALIZAÇÃO DA PÁGINA

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM completamente carregado. Iniciando busca de charadas...");
    buscarListarCharadas();
});
