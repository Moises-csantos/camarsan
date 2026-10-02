// =====================================================
// CAMARSAN - PÁGINA HISTÓRIA
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    inicializarHistoria();
});

function inicializarHistoria() {
    // Atualiza o ano no rodapé
    const spanAno = document.getElementById("ano-atual");
    if (spanAno) {
        spanAno.textContent = new Date().getFullYear();
    }

    // Atualiza o contador do carrinho no cabeçalho
    atualizarContadorCarrinho();
}

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("camarsan_carrinho")) || [];
    const contadorTopo = document.getElementById("contador-carrinho");
    if (contadorTopo) {
        contadorTopo.textContent = carrinho.length;
    }
}