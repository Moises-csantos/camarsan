document.addEventListener("DOMContentLoaded", () => {
    const spanAno = document.getElementById("ano-atual");
    if (spanAno) spanAno.textContent = new Date().getFullYear();

    carregarCarrinho();

    document.getElementById("btn-limpar-carrinho").addEventListener("click", () => {
        if (confirm("Deseja mesmo esvaziar o carrinho?")) {
            localStorage.removeItem("camarsan_carrinho");
            carregarCarrinho();
        }
    });

    document.getElementById("btn-finalizar-whatsapp").addEventListener("click", () => {
        enviarPedidoWhatsApp();
    });
});

function carregarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem("camarsan_carrinho")) || [];
    const listaContainer = document.getElementById("lista-carrinho");
    const resumoQtd = document.getElementById("resumo-qtd");
    const resumoTotal = document.getElementById("resumo-total");
    const contadorTopo = document.getElementById("contador-carrinho");

    if (contadorTopo) contadorTopo.textContent = carrinho.length;
    resumoQtd.textContent = carrinho.length;

    if (carrinho.length === 0) {
        listaContainer.innerHTML = `
            <div style="background: #fff; padding: 30px; border-radius: 8px; text-align: center; border: 1px solid #e1e1e1; width: 100%;">
                <p style="color: var(--cinza); margin-bottom: 15px;">O seu carrinho está vazio.</p>
                <a href="catalogo.html" class="btn-detalhes" style="display: inline-block; width: auto; padding: 10px 20px;">Ver Catálogo</a>
            </div>
        `;
        resumoTotal.textContent = "R$ 0,00";
        return;
    }

    listaContainer.innerHTML = "";
    let totalGeral = 0;

    carrinho.forEach((produto, index) => {
        totalGeral += Number(produto.preco || 0);
        const imagemCapa = (produto.imagens && produto.imagens.length > 0) ? produto.imagens[0] : '../assets/logo/logo.png';

        const itemDiv = document.createElement("div");
        itemDiv.className = "carrinho-item";
        itemDiv.innerHTML = `
            <img src="${imagemCapa}" alt="${produto.nome}">
            <div class="carrinho-item-info">
                <h4>${produto.nome}</h4>
                <p>R$ ${Number(produto.preco).toFixed(2)}</p>
                <button onclick="removerItem(${index})" class="btn-remover-item">Remover</button>
            </div>
        `;
        listaContainer.appendChild(itemDiv);
    });

    resumoTotal.textContent = `R$ ${totalGeral.toFixed(2)}`;
}

function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem("camarsan_carrinho")) || [];
    carrinho.splice(index, 1);
    localStorage.setItem("camarsan_carrinho", JSON.stringify(carrinho));
    carregarCarrinho();
}

function enviarPedidoWhatsApp() {
    let carrinho = JSON.parse(localStorage.getItem("camarsan_carrinho")) || [];
    if (carrinho.length === 0) {
        alert("O seu carrinho está vazio!");
        return;
    }

    let mensagem = "💍 *Novo Pedido - CamarSan Alianças*\n\n";
    let totalGeral = 0;

    carrinho.forEach((produto, i) => {
        let imagemCapa = (produto.imagens && produto.imagens.length > 0) ? produto.imagens[0] : '';
        
        mensagem += `${i + 1}. *${produto.nome}*\n`;
        mensagem += `   Preço: R$ ${Number(produto.preco).toFixed(2)}\n`;
        if (imagemCapa) {
            mensagem += `   📷 Foto do modelo: ${imagemCapa}\n`;
        }
        mensagem += `\n`;
        
        totalGeral += Number(produto.preco || 0);
    });

    mensagem += `*Total do Pedido:* R$ ${totalGeral.toFixed(2)}`;
    mensagem += `\n\nPoderia me orientar sobre os tamanhos e o prazo de fabricação?`;

    const numeroWhatsApp = "5554996322787"; 
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
}
