// =====================================================
// CAMARSAN - PÁGINA DE DETALHES DE MOEDAS E NOTAS
// =====================================================

const CONFIG_NUMISMATICA = {
    API_URL: "https://aliancascamarsan1993.pythonanywhere.com"
};


// -----------------------------------------------------
// INICIALIZAÇÃO
// -----------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    carregarItemNumismatica();
});


// -----------------------------------------------------
// CARREGAR PEÇA NUMISMÁTICA
// -----------------------------------------------------

async function carregarItemNumismatica() {

    const container = document.querySelector("#item-numismatica-container");

    if (!container) {
        console.warn("Container do item numismático não encontrado.");
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const idItem = parametros.get("id");

    if (!idItem) {
        container.innerHTML = `
            <p>Peça não especificada.</p>
        `;
        return;
    }

    try {
        // Altere a rota da API conforme o endpoint configurado no seu backend (ex: /numismatica)
        const resposta = await fetch(`${CONFIG_NUMISMATICA.API_URL}/numismatica`);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const itens = await resposta.json();

        const item = itens.find(
            obj => String(obj.id) === String(idItem)
        );

        if (!item) {
            container.innerHTML = `
                <p>Peça não encontrada no acervo.</p>
            `;
            return;
        }

        exibirItemNumismatica(item);

    } catch (erro) {
        console.error("Erro ao carregar item numismático:", erro);
        container.innerHTML = `
            <p>Não foi possível carregar os detalhes da peça no momento.</p>
        `;
    }
}


// -----------------------------------------------------
// EXIBIR PEÇA NUMISMÁTICA
// -----------------------------------------------------

function exibirItemNumismatica(item) {

    const container = document.querySelector("#item-numismatica-container");

    // Garante que o array de imagens existe
    const imagens = (item.imagens && Array.isArray(item.imagens) && item.imagens.length > 0) 
        ? item.imagens 
        : ['../assets/logo/logo.png'];

    container.innerHTML = `

        <div class="produto-galeria">

            <div class="produto-imagem-principal-container">
                <img
                    id="imagem-principal"
                    src="${imagens[0]}"
                    alt="${item.nome}"
                    class="produto-imagem-principal"
                >
            </div>

            <div class="produto-miniaturas">
                ${imagens.map((imagem, index) => `
                    <button
                        type="button"
                        class="miniatura ${index === 0 ? "ativa" : ""}"
                        data-imagem="${imagem}"
                        aria-label="Ver imagem ${index + 1}"
                    >
                        <img
                            src="${imagem}"
                            alt="${item.nome} - imagem${index + 1}"
                        >
                    </button>
                `).join("")}
            </div>

        </div>


        <div class="produto-informacoes">

            <p class="produto-categoria">
                Numismática CamarSan — ${item.tipo || 'Peça Colecionável'}
            </p>

            <h1>
                ${item.nome}
            </h1>

            <p class="produto-descricao">
                ${item.descricao || 'Peça histórica exclusiva do nosso acervo.'}
            </p>

            <div class="produto-caracteristicas">

                <p>
                    <strong>Tipo:</strong>
                    ${item.tipo || 'Não informado'}
                </p>

                <p>
                    <strong>Ano / Período:</strong>
                    ${item.ano || 'Não especificado'}
                </p>

                <p>
                    <strong>Estado de Conservação:</strong>
                    ${item.estado_conservacao || item.estado || 'Não informado'}
                </p>

            </div>

            <p class="produto-preco">
                R$ ${Number(item.preco).toFixed(2).replace(".", ",")}
            </p>

            <a
                href="#"
                class="btn-whatsapp-personalizado"
                id="item-whatsapp"
                target="_blank"
                rel="noopener noreferrer">
                <img src="../assets/icones/whats.png" alt="WhatsApp" class="icone-contato-btn">
                Quero adquirir esta peça
            </a>

        </div>

    `;

    inicializarGaleriaNumismatica();

    // --- CONFIGURAR BOTÃO WHATSAPP ESPECÍFICO PARA A PEÇA ---

    const btnWhatsapp = document.getElementById("item-whatsapp");
    if (btnWhatsapp) {
        btnWhatsapp.addEventListener("click", (e) => {
            e.preventDefault();

            const imagemCapa = imagens[0] || '';
            const precoFormatado = `R$ ${Number(item.preco).toFixed(2).replace(".", ",")}`;

            let mensagem = `🪙 *Consulta sobre Peça Numismática - CamarSan*\n\n`;
            mensagem += `Olá! Gostaria de adquirir ou saber mais detalhes sobre:\n`;
            mensagem += `*${item.nome}*\n`;
            mensagem += `Tipo: ${item.tipo || 'Peça Rara'}\n`;
            mensagem += `Preço: ${precoFormatado}\n`;

            if (imagemCapa) {
                // Converte qualquer caminho relativo (com ../ ou ./) na URL pública exata do site
                const urlFoto = (imagemCapa.startsWith('http://') || imagemCapa.startsWith('https://'))
                    ? imagemCapa
                    : new URL(imagemCapa, window.location.href).href;

                mensagem += `📷 Foto da peça: ${urlFoto}\n`;
            }

            mensagem += `\nAinda está disponível para envio?`;

            const numeroWhatsApp = "5554996322787";
            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

            window.open(url, "_blank");
        });
    }
}


// -----------------------------------------------------
// GALERIA DE FOTOS
// -----------------------------------------------------

function inicializarGaleriaNumismatica() {
    const imagemPrincipal = document.querySelector("#imagem-principal");
    const miniaturas = document.querySelectorAll(".miniatura");

    miniaturas.forEach((miniatura) => {
        miniatura.addEventListener("click", () => {
            const novaImagem = miniatura.dataset.imagem;
            imagemPrincipal.src = novaImagem;

            miniaturas.forEach((item) => {
                item.classList.remove("ativa");
            });

            miniatura.classList.add("ativa");
        });
    });
}
