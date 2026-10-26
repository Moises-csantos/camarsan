// =====================================================
// CAMARSAN - LÓGICA DO CATÁLOGO DE ALIANÇAS COM FILTROS
// =====================================================

let listaProdutosGlobal = [];

document.addEventListener("DOMContentLoaded", () => {
    const spanAno = document.getElementById("ano-atual");
    if (spanAno) {
        spanAno.textContent = new Date().getFullYear();
    }

    atualizarContadorCarrinho();

    const containerCatalogo = document.getElementById("lista-catalogo");
    const API_URL = "https://aliancascamarsan1993.pythonanywhere.com/produtos"; 

    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error("Erro ao carregar os produtos.");
            return response.json();
        })
        .then(produtos => {
            listaProdutosGlobal = produtos;
            renderizarProdutos(listaProdutosGlobal);
            configurarFiltros();
        })
        .catch(error => {
            console.error("Erro:", error);
            containerCatalogo.innerHTML = `<p class="carregando-texto" style="color: red;">Não foi possível carregar as alianças.</p>`;
        });
});

function renderizarProdutos(produtos) {
    const containerCatalogo = document.getElementById("lista-catalogo");
    containerCatalogo.innerHTML = "";

    // Remove indicadores antigos antes de recriar
    const indicadoresAntigos = document.getElementById("catalogo-indicadores");
    if (indicadoresAntigos) indicadoresAntigos.remove();

    if (produtos.length === 0) {
        containerCatalogo.innerHTML = `<p class="carregando-texto">Nenhuma peça encontrada com os filtros selecionados.</p>`;
        return;
    }

    produtos.forEach((produto, index) => {
        const imagemCapa = (produto.imagens && produto.imagens.length > 0) 
            ? produto.imagens[0] 
            : '../assets/logo/logo.png';

        const card = document.createElement("div");
        card.className = "produto-card";
        card.dataset.index = index;

        card.innerHTML = `
            <div class="produto-card-img">
                <img src="${imagemCapa}" alt="${produto.nome}">
            </div>
            <div class="produto-card-body">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao ? produto.descricao.substring(0, 80) + '...' : 'Aliança artesanal exclusiva.'}</p>
                <div class="produto-preco">R$ ${Number(produto.preco).toFixed(2)}</div>
                <div class="produto-botoes">
                    <a href="produto.html?id=${produto.id}" class="btn-detalhes">Detalhes</a>
                    <button class="btn-add-carrinho" data-produto='${JSON.stringify(produto)}'>Adicionar</button>
                </div>
            </div>
        `;

        containerCatalogo.appendChild(card);
    });

    configurarBotoesCarrinho();
    criarMarcadoresPosicao(produtos.length);
}

function configurarFiltros() {
    const fFormato = document.getElementById('filtro-cat-formato');
    const fFrisos = document.getElementById('filtro-cat-frisos');
    const fAcabamento = document.getElementById('filtro-cat-acabamento');
    const fAco = document.getElementById('filtro-cat-aco');
    const fFinalidade = document.getElementById('filtro-cat-finalidade');
    const fTipo = document.getElementById('filtro-cat-tipo');

    const elementosFiltro = [fFormato, fFrisos, fAcabamento, fAco, fFinalidade, fTipo];
    const filtroDropdownMenu = document.getElementById('filtro-dropdown-menu');

    elementosFiltro.forEach(filtro => {
        if (filtro) {
            filtro.addEventListener('change', () => {
                aplicarFiltrosDinamicos();
                // Recolhe o menu de filtros automaticamente após selecionar uma opção
                if (filtroDropdownMenu) {
                    filtroDropdownMenu.classList.remove('ativo');
                }
            });
        }
    });
}

function aplicarFiltrosDinamicos() {
    const formatoVal = document.getElementById('filtro-cat-formato')?.value || "";
    const frisosVal = document.getElementById('filtro-cat-frisos')?.value || "";
    const acabamentoVal = document.getElementById('filtro-cat-acabamento')?.value || "";
    const acoVal = document.getElementById('filtro-cat-aco')?.value || "";
    const finalidadeVal = document.getElementById('filtro-cat-finalidade')?.value || "";
    const tipoVal = document.getElementById('filtro-cat-tipo')?.value || "";

    const produtosFiltrados = listaProdutosGlobal.filter(produto => {
        // Compara ignorando maiúsculas/minúsculas se o campo existir no registo da API
        if (formatoVal && produto.formato && produto.formato !== formatoVal) return false;
        if (frisosVal && produto.frisos && produto.frisos !== frisosVal) return false;
        if (acabamentoVal && produto.acabamento && !produto.acabamento.includes(acabamentoVal)) return false;
        if (acoVal && produto.aco && produto.aco !== acoVal) return false;
        if (finalidadeVal && produto.finalidade && produto.finalidade !== finalidadeVal) return false;
        if (tipoVal && produto.tipo && produto.tipo !== tipoVal) return false;

        return true;
    });

    renderizarProdutos(produtosFiltrados);
}

function criarMarcadoresPosicao(totalProdutos) {
    const containerCatalogo = document.getElementById("lista-catalogo");
    const secaoCatalogo = document.querySelector(".secao-catalogo");

    if (!containerCatalogo || !secaoCatalogo) return;

    const indicadoresContainer = document.createElement("div");
    indicadoresContainer.className = "catalogo-indicadores";
    indicadoresContainer.id = "catalogo-indicadores";

    for (let i = 0; i < totalProdutos; i++) {
        const bolinha = document.createElement("button");
        bolinha.type = "button";
        bolinha.className = i === 0 ? "bolinha-indicador ativa" : "bolinha-indicador";
        bolinha.setAttribute("aria-label", `Ir para aliança ${i + 1}`);
        bolinha.dataset.index = i;

        bolinha.addEventListener("click", () => {
            const cards = containerCatalogo.querySelectorAll(".produto-card");
            if (cards[i]) {
                cards[i].scrollIntoView({
                    behavior: "smooth",
                    inline: "start",
                    block: "nearest"
                });
            }
        });

        indicadoresContainer.appendChild(bolinha);
    }

    secaoCatalogo.appendChild(indicadoresContainer);

    containerCatalogo.addEventListener("scroll", () => {
        const cards = containerCatalogo.querySelectorAll(".produto-card");
        const bolinhas = indicadoresContainer.querySelectorAll(".bolinha-indicador");
        
        let cardMaisProximo = 0;
        let menorDistancia = Infinity;

        cards.forEach((card, index) => {
            const distancia = Math.abs(card.offsetLeft - containerCatalogo.scrollLeft);
            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                cardMaisProximo = index;
            }
        });

        bolinhas.forEach((bolinha, index) => {
            if (index === cardMaisProximo) {
                bolinha.classList.add("ativa");
            } else {
                bolinha.classList.remove("ativa");
            }
        });
    }, { passive: true });
}

function configurarBotoesCarrinho() {
    document.querySelectorAll('.btn-add-carrinho').forEach(botao => {
        botao.addEventListener('click', (e) => {
            const produto = JSON.parse(e.target.getAttribute('data-produto'));
            let carrinho = JSON.parse(localStorage.getItem('camarsan_carrinho')) || [];
            
            carrinho.push(produto);
            localStorage.setItem('camarsan_carrinho', JSON.stringify(carrinho));

            atualizarContadorCarrinho();
            alert(`"${produto.nome}" foi adicionado ao seu carrinho!`);
        });
    });
}

function atualizarContadorCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('camarsan_carrinho')) || [];
    const contador = document.getElementById("contador-carrinho");
    if (contador) contador.textContent = carrinho.length;
}
