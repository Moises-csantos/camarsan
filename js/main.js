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
    inicializarDepoimentos();      // <--- Carrega os depoimentos
    inicializarEnvioDepoimento();  // <--- Processa o formulário
    inicializarCarrosselDiferenciais(); // <--- CHAMADA OBRIGATÓRIA DA FUNÇÃO
}

// A função fica fora (separada), logo abaixo:
function inicializarCarrosselDiferenciais() {
    const container = document.querySelector("#carrossel-diferenciais");
    const containerIndicadores = document.querySelector("#indicadores-diferenciais");

    if (!container || !containerIndicadores) return;

    const cards = container.querySelectorAll(".diferencial-card");
    containerIndicadores.innerHTML = "";

    // Cria uma bolinha para cada cartão
    cards.forEach((_, index) => {
        const ponto = document.createElement("div");
        ponto.classList.add("indicador-ponto");
        if (index === 0) ponto.classList.add("ativo");
        containerIndicadores.appendChild(ponto);
    });

    const pontos = containerIndicadores.querySelectorAll(".indicador-ponto");

    // Monitora o scroll horizontal para atualizar a bolinha ativa
    container.addEventListener("scroll", () => {
        const indexAtivo = Math.round(container.scrollLeft / container.clientWidth);
        
        pontos.forEach((ponto, index) => {
            if (index === indexAtivo) {
                ponto.classList.add("ativo");
            } else {
                ponto.classList.remove("ativo");
            }
        });
    });
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
// =====================================================
// LÓGICA DA CONVERSA INTERATIVA COM O MOISES
// =====================================================

// 1. Definição do Roteiro (Cenas, Falas, Imagens e Posições)
const roteiroConversa = [
    {
        // Cena 0: Início (Estado inicial definido no HTML)
        fala: "Olá! Sou o Moises, o artesão da CamarSan. Clique em mim para começarmos a nossa conversa e conhecer as nossas alianças.",
        botao: "Vamos lá!",
        imagem: "mascote-ola.png", // Imagem padrão
        posicao: "centro" // left: 0
    },
    {
        // Cena 1: Sobre
        fala: "Na CamarSan, nós não fazemos apenas alianças. Nós transformamos moedas antigas em joias artesanais que carregam histórias e perpetuam gerações. Incrível, não é?",
        botao: "Como funciona?",
        imagem: "mascote-explicando.png", // Carregue esta imagem
        posicao: "direita" // Ex: move para a direita (left: 50px)
    },
    {
        // Cena 2: Como Funciona
        fala: "É simples! Você escolhe o modelo no nosso catálogo, combinamos todos os detalhes e medidas pelo WhatsApp, e eu forjo a sua peça à mão. Quer ver alguns modelos?",
        botao: "Quero ver os destaques!",
        imagem: "mascote-duvida.png", // Carregue esta imagem (talvez apontando)
        posicao: "esquerda" // Ex: move para a esquerda (left: -50px)
    },
    {
        fala: "Estes são os nossos modelos mais queridos. Passe para o lado para ver! Gostou de algum?",
        botao: "Sim! Como recebo?",
        imagem: "mascote.png", 
        posicao: "centro",
        acao: () => {
            // 1. Guarda a posição exata onde a tela estava antes de descer
            const posicaoOriginal = window.scrollY;

            // 2. Desce suavemente até aos destaques para o cliente ver os produtos
            document.querySelector('#destaques').scrollIntoView({ behavior: 'smooth' });

            // 3. Aguarda 4 segundos e retorna exatamente para onde o utilizador estava
            setTimeout(() => {
                window.scrollTo({
                    top: posicaoOriginal,
                    behavior: 'smooth'
                });
            }, 3000);
        }
    },
    {
        // Cena 4: Recebimento / WhatsApp
        fala: "Nós enviamos para todo o Brasil via Correios, entregamos por motoboy na região ou você pode retirar presencialmente. Se tiver qualquer dúvida sobre medidas ou modelos, é só me chamar no WhatsApp aqui embaixo. Até breve!",
        botao: "Entendi, obrigado!",
        imagem: "mascote-tchau.png", // Carregue esta imagem (acenando)
        posicao: "centro",
        final: true // Indica o fim da conversa
    }
];

// 2. Variáveis de Estado
let cenaAtual = 0;
const caminhoImagens = "assets/mascote/"; // Pasta onde estão as novas imagens

// 3. Elementos do DOM
const areaMascote = document.getElementById('area-mascote');
const imgMascote = document.getElementById('img-mascote');
const balaoFala = document.getElementById('balao-fala-moises');
const textoFala = document.getElementById('texto-fala');
const btnProxima = document.getElementById('btn-proxima-fala');

// 4. Função para Atualizar a Cena
function atualizarCena() {
    const dadosCena = roteiroConversa[cenaAtual];

    // Oculta o balão temporariamente para o efeito de "pop"
    balaoFala.classList.remove('visivel');

    // Pequeno delay para a troca de imagem e movimento
    setTimeout(() => {
        // A) Mudar a Imagem do Mascote (com troca suave)
        imgMascote.style.opacity = 0;
        setTimeout(() => {
            imgMascote.src = caminhoImagens + dadosCena.imagem;
            imgMascote.alt = "Moises explicando: " + dadosCena.fala.substring(0, 30) + "...";
            imgMascote.style.opacity = 1;
        }, 150);

        // B) Mudar a Posição/Movimento do Mascote
        switch (dadosCena.posicao) {
            case "direita":
                areaMascote.style.left = "50px";
                break;
            case "esquerda":
                areaMascote.style.left = "-50px";
                break;
            default: // centro
                areaMascote.style.left = "0";
        }

        // C) Mudar o Texto e o Botão do Balão
        textoFala.textContent = dadosCena.fala;
        btnProxima.textContent = dadosCena.botao;

        // D) Executar ação especial da cena se houver (ex: scroll)
        if (dadosCena.acao) {
            dadosCena.acao();
        }

        // E) Controlar o botão se for a cena final
        if (dadosCena.final) {
            btnProxima.style.display = 'none'; // Oculta o botão no fim
            // Opcional: focar no botão do WhatsApp global da página
            // document.querySelector('#botao-whatsapp').classList.add('destaque-piscar');
        } else {
            btnProxima.style.display = 'inline-block';
        }

        // F) Mostrar o balão novamente com o efeito
        balaoFala.classList.add('visivel');

    }, 300); // Tempo do delay total
}

// 5. Event Listeners (Cliques)

// Clique no Mascote (Área completa)
areaMascote.addEventListener('click', () => {
    // Se já estiver visível e não for o fim, avança. Se estiver oculto, mostra.
    if (balaoFala.classList.contains('visivel')) {
        avancarConversa();
    } else {
        balaoFala.classList.add('visivel');
    }
});

// Clique no Botão do Balão
btnProxima.addEventListener('click', (e) => {
    e.stopPropagation(); // Impede que o clique no botão ative o clique no mascote atrás
    avancarConversa();
});

// Função para avançar a lógica
function avancarConversa() {
    if (cenaAtual < roteiroConversa.length - 1) {
        cenaAtual++;
        atualizarCena();
    } else {
        // Fim da conversa, talvez ocultar o balão após um tempo
        balaoFala.classList.remove('visivel');
        cenaAtual = 0; // Reseta para o início se clicar de novo
    }
}

