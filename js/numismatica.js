// =====================================================
// CAMARSAN - LÓGICA DA PÁGINA DE NUMISMÁTICA
// =====================================================

const URL_API_NUMISMATICA = "https://aliancascamarsan1993.pythonanywhere.com/numismatica";

document.addEventListener("DOMContentLoaded", () => {
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
            const preco = Number(item.preco || 0).toFixed(2).replace(".", ",");
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
                        <div class="produto-preco">R$ ${preco}</div>
                        <div class="produto-botoes">
                            <a href="item-numismatica.html?id=${itemId}" class="btn-detalhes">Ver Detalhes</a>
                        </div>
                    </div>
                </div>
            `;
        });

        listaDiv.innerHTML = html;

    } catch (erro) {
        console.error("Erro ao carregar numismática:", erro);
        listaDiv.innerHTML = '<p class="carregando-texto" style="color: red;">Erro ao carregar lista de peças da API.</p>';
    }
}