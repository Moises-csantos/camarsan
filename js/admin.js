// --- BOTÃO SAIR / BLOQUEAR PAINEL CORRIGIDO ---
document.addEventListener('DOMContentLoaded', () => {
    const botaoSair = document.getElementById('btn-sair') || document.getElementById('btnSair');

    if (botaoSair) {
        botaoSair.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Esconde o painel e mostra a secção de login
            if (secaoPainel) secaoPainel.style.display = 'none';
            if (secaoLogin) secaoLogin.style.display = 'block';
            
            // Limpa o campo de senha e formulários
            const inputSenha = document.getElementById('senha-admin');
            if (inputSenha) inputSenha.value = '';
            
            if (formProduto) formProduto.reset();
            
            // Limpa o preview das imagens se houver
            arquivosSelecionados = [];
            const containerPreview = document.getElementById('preview-imagens-admin');
            if (containerPreview) containerPreview.innerHTML = '';
            
            console.log('Sessão encerrada com sucesso.');
        });
    } else {
        console.warn('Aviso: O botão de sair com ID "btn-sair" não foi encontrado.');
    }
});
