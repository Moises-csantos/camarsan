
// =====================================================
// BOTÃO TIRAR DÚVIDAS VIA WHATSAPP (PÁGINA COMO FUNCIONA)
// =====================================================
const btnFinalizarWhatsapp = document.getElementById("btn-finalizar-whatsapp");
if (btnFinalizarWhatsapp) {
    btnFinalizarWhatsapp.addEventListener("click", (e) => {
        e.preventDefault();

        let mensagem = `💍 *Dúvidas sobre Encomenda - Site CamarSan*\n\n`;
        mensagem += `Olá! Li as informações na página "Como Funciona" e gostaria de tirar algumas dúvidas sobre as alianças.\n\n`;
        mensagem += `Poderia me ajudar?`;

        const numeroWhatsApp = "5554996322787";
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

        window.open(url, "_blank");
    });
}
// =====================================================
// CAMARSAN - SCRIPT GLOBAL (CARRINHO E RODAPÉ)
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    // Atualiza o ano no rodapé automaticamente em qualquer página
    const spanAno = document.getElementById("ano-atual");
    if (spanAno) {
        spanAno.textContent = new Date().getFullYear();
    }

    // Atualiza o contador do carrinho no cabeçalho em qualquer página
    atualizarContadorCarrinho();
});

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("camarsan_carrinho")) || [];
    const contadorTopo = document.getElementById("contador-carrinho");
    if (contadorTopo) {
        contadorTopo.textContent = carrinho.length;
    }
}