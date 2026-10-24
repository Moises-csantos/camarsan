// =====================================================
// CAMARSAN - LÓGICA DA PÁGINA DE NUMISMÁTICA
// =====================================================

const URL_API_NUMISMATICA = "https://aliancascamarsan1993.pythonanywhere.com/numismatica";

document.addEventListener("DOMContentLoaded", () => {
    // Atualizar o contador do carrinho ao carregar a página
    atualizarContadorCarrinhoNumismatica();
    
    // Carregar os itens da API
    carregarCatalogoNumismatica();
});

async function carregarCatalogoNumismatica() {
    const listaDiv = document.getElementById("lista-numismatica");
    if (!listaDiv) return;

    listaDiv.innerHTML = '<p class="carregando-texto">A carregar acervo...</p>';

    try {
        const resposta = await fetch(URL_API_NUMISMATICA);
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const itens = await resposta.json();

        if (itens.length === 0) {
            listaDiv.innerHTML = '<p class="carregando-texto">Nenhuma peça cadastrada no acervo no momento.</p>';
            return;
        }

        let html = "";

        itens.forEach(item => {
            const itemId = item.id;
            const nome = item.nome || "Peça Rara";
            const preco = Number(item.preco || 0).toFixed(2);
            const tipo = item.tipo || "Moeda";
            const ano = item.ano || "N/D";
            const estado = item.estado_conservacao || "Conservação não informada";

            const imagemCapa = (item.imagens && item.imagens.length > 0)
                ? item.imagens[0]
                : "../assets/logo/logo.png";

            html += `
                <div class="produto-card">
                    <div class="produto-card-img">
                        <img src="${imagemCapa}" alt="${nome}" loading="lazy">
                    </div>
                    <div class="produto-card-body">
                        <span class="evento-data-badge">${tipo} • Ano: ${ano}</span>
                        <h3>${nome}</h3>
                        <p>${estado}</p>
                        <div class="produto-preco">R$ ${Number(preco).toFixed(2).replace(".", ",")}</div>
                        <div class="produto-botoes">
                            <a href="item-numismatica.html?id=${itemId}" class="btn-detalhes">Ver Detalhes</a>
                            <button class="btn-add-carrinho" data-produto='${JSON.stringify(item)}'>Adicionar</button>
                        </div>
                    </div>
                </div>
            `;
        });

        // Insere o HTML gerado na página primeiro
        listaDiv.innerHTML = html;

        // Depois ativa a funcionalidade do carrinho para os botões recém-criados
        configurarBotoesCarrinhoNumismatica();

    } catch (erro) {
        console.error("Erro ao carregar numismática:", erro);
        listaDiv.innerHTML = '<p class="carregando-texto" style="color: red;">Erro ao carregar lista de peças da API.</p>';
    }
}

function configurarBotoesCarrinhoNumismatica() {
    document.querySelectorAll('#lista-numismatica .btn-add-carrinho').forEach(botao => {
        botao.addEventListener('click', (e) => {
            const produto = JSON.parse(e.target.getAttribute('data-produto'));
            let carrinho = JSON.parse(localStorage.getItem('camarsan_carrinho')) || [];

            carrinho.push(produto);
            localStorage.setItem('camarsan_carrinho', JSON.stringify(carrinho));

            atualizarContadorCarrinhoNumismatica();
            alert(`"${produto.nome}" foi adicionado ao seu carrinho!`);
        });
    });
}

function atualizarContadorCarrinhoNumismatica() {
    let carrinho = JSON.parse(localStorage.getItem('camarsan_carrinho')) || [];
    const contador = document.getElementById("contador-carrinho");
    if (contador) contador.textContent = carrinho.length;
}
