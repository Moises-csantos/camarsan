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
    inicializarDepoimentos();      // <--- Adicionado para carregar os depoimentos
    inicializarEnvioDepoimento();  // <--- Adicionado para processar o formulário
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
// API - PRODUTOS EM DESTAQUE
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


// -----------------------------------------------------
// API - DEPOIMENTOS PÚBLICOS
// -----------------------------------------------------

async function inicializarDepoimentos() {
    const container = document.querySelector("#lista-depoimentos-publicos");

    if (!container) {
        return;
    }

    try {
        const resposta = await fetch(`${CONFIG.API_URL}/depoimentos`);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const depoimentos = await resposta.json();
        container.innerHTML = "";

        if (depoimentos.length === 0) {
            container.innerHTML = "<p>Ainda não há depoimentos publicados. Seja o primeiro a avaliar!</p>";
            return;
        }

        depoimentos.forEach(d => {
            const estrelasStr = "⭐".repeat(d.estrelas);
            const imagemHtml = d.foto_path ? `<img src="${CONFIG.API_URL}/uploads/${d.foto_path}" alt="Foto do cliente" style="width: 100%; height: 160px; object-fit: cover; border-radius: 6px; margin-top: 10px;">` : '';

            const card = document.createElement("div");
            card.classList.add("card-depoimento-publico");

            card.innerHTML = `
                <div>
                    <div style="color: #f39c12; margin-bottom: 8px; font-size: 0.9rem;">${estrelasStr}</div>
                    <p>"${d.mensagem}"</p>
                </div>
                <div>
                    ${imagemHtml}
                    <div style="margin-top: 12px; border-top: 1px solid #f0f0f0; padding-top: 8px;">
                        <strong style="display: block; font-size: 0.9rem; color: #222;">${d.nome}</strong>
                        <small style="color: #777;">${d.cidade}</small>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

        console.log(`${depoimentos.length} depoimentos carregados pela API.`);

    } catch (erro) {
        console.error("Erro ao carregar depoimentos:", erro);
        container.innerHTML = "<p>Não foi possível carregar os depoimentos no momento.</p>";
    }
}


// -----------------------------------------------------
// API - ENVIO DE NOVO DEPOIMENTO
// -----------------------------------------------------

function inicializarEnvioDepoimento() {
    const form = document.querySelector("#form-enviar-depoimento");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nome', document.querySelector("#depo-nome").value);
        formData.append('cidade', document.querySelector("#depo-cidade").value);
        formData.append('estrelas', document.querySelector("#depo-estrelas").value);
        formData.append('mensagem', document.querySelector("#depo-mensagem").value);

        const fotoInput = document.querySelector("#depo-foto");
        if (fotoInput && fotoInput.files.length > 0) {
            formData.append('foto', fotoInput.files[0]);
        }

        try {
            const resposta = await fetch(`${CONFIG.API_URL}/depoimentos`, {
                method: 'POST',
                body: formData
            });

            if (resposta.ok) {
                alert("Muito obrigado! O seu depoimento foi enviado com sucesso e será publicado após a nossa verificação.");
                form.reset();
            } else {
                alert("Erro ao enviar o depoimento. Tente novamente.");
            }
        } catch (erro) {
            console.error("Erro:", erro);
            alert("Não foi possível conectar ao servidor para enviar o depoimento.");
        }
    });
}
