document.addEventListener("DOMContentLoaded", () => {
    const spanAno = document.getElementById("ano-atual");
    if (spanAno) {
        spanAno.textContent = new Date().getFullYear();
    }

    // Atualizar o contador do carrinho ao carregar a página
    atualizarContadorCarrinho();

    const containerCatalogo = document.getElementById("lista-catalogo");
    const API_URL = "https://aliancascamarsan1993.pythonanywhere.com/produtos"; 

    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error("Erro ao carregar os produtos.");
            return response.json();
        })
        .then(produtos => {
            containerCatalogo.innerHTML = "";

            if (produtos.length === 0) {
                containerCatalogo.innerHTML = `<p class="carregando-texto">Nenhuma aliança cadastrada no momento.</p>`;
                return;
            }

            produtos.forEach(produto => {
                const imagemCapa = (produto.imagens && produto.imagens.length > 0) 
                    ? produto.imagens[0] 
                    : '../assets/logo/logo.png';

                const card = document.createElement("div");
                card.className = "produto-card";

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
        })
        .catch(error => {
            console.error("Erro:", error);
            containerCatalogo.innerHTML = `<p class="carregando-texto" style="color: red;">Não foi possível carregar as alianças.</p>`;
        });
});

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