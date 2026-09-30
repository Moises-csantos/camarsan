// =====================================================
// CAMARSAN - JAVASCRIPT PRINCIPAL
// Arquivo responsável pelos comportamentos da página inicial
// =====================================================


// -----------------------------------------------------
// CONFIGURAÇÕES
// -----------------------------------------------------

const CONFIG = {
    // Endereço da API da CamarSan
    API_URL: "https://aliancascamarsan1993.pythonanywhere.com",

    // Nome da aplicação
    APP_NAME: "CamarSan"
};


// -----------------------------------------------------
// INICIALIZAÇÃO
// -----------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    inicializarSite();
});


// -----------------------------------------------------
// INICIALIZAÇÃO DO SITE
// -----------------------------------------------------

function inicializarSite() {
    console.log(`${CONFIG.APP_NAME} iniciado.`);

    inicializarMenu();
    inicializarBotoes();
    inicializarAno();
    inicializarProdutosDestaque();
}


// -----------------------------------------------------
// MENU
// -----------------------------------------------------

function inicializarMenu() {
    const menuButton = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".nav-menu");

    if (!menuButton || !menu) {
        return;
    }

    menuButton.addEventListener("click", () => {
        menu.classList.toggle("ativo");
    });
}


// -----------------------------------------------------
// BOTÕES
// -----------------------------------------------------

function inicializarBotoes() {
    const botoesWhatsApp = document.querySelectorAll(".btn-whatsapp");

    botoesWhatsApp.forEach((botao) => {
        botao.addEventListener("click", () => {
            console.log("Botão WhatsApp acionado.");
        });
    });
}


// -----------------------------------------------------
// ANO DO RODAPÉ
// -----------------------------------------------------

function inicializarAno() {
    const elementoAno = document.querySelector("#ano-atual");

    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }
}


// -----------------------------------------------------
// API - ESTRUTURA FUTURA
// -----------------------------------------------------

// -----------------------------------------------------
// API - ESTRUTURA FUTURA
// -----------------------------------------------------

async function inicializarProdutosDestaque() {

    const container = document.querySelector("#produtos-destaque");

    if (!container) {
        console.warn("Container de produtos em destaque não encontrado.");
        return;
    }

    try {

        const resposta = await fetch(`${CONFIG.API_URL}/produtos`);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const produtos = await resposta.json();

        container.innerHTML = "";

        if (produtos.length === 0) {
            container.innerHTML = "<p>Nenhuma aliança cadastrada no momento.</p>";
            return;
        }

        // Pega os produtos (ou usa slice para mostrar por exemplo os 4 primeiros)
        produtos.slice(0, 4).forEach(produto => {

            const card = document.createElement("article");

            card.classList.add("produto-card");

            const fotoUrl = produto.imagens && produto.imagens.length > 0 ? produto.imagens[0] : '';

            card.innerHTML = `
                <img
                  src="${fotoUrl}"
                  alt="${produto.nome}"
                >

                <h3>${produto.nome}</h3>

                <p>${produto.descricao || ''}</p>

                <p class="produto-preco">R$ ${produto.preco.toFixed(2).replace(".", ",")}</p>

                <a href="pages/produto.html?id=${produto.id}">
                    Ver detalhes
                </a>
            `;

            container.appendChild(card);
        });

        console.log(`${produtos.length} produtos carregados pela API.`);

    } catch (erro) {

        console.error("Erro ao carregar produtos:", erro);

        container.innerHTML = `
            <p>Não foi possível carregar os produtos.</p>
        `;
    }
}
