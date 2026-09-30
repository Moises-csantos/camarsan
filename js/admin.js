const SENHA_MESTRE = "12345"; 

const secaoLogin = document.getElementById('secao-login');
const secaoPainel = document.getElementById('secao-painel');
const formLogin = document.getElementById('form-login');
const formProduto = document.getElementById('form-produto');
const btnSair = document.getElementById('btn-sair');

formLogin.addEventListener('submit', function(e) {
    e.preventDefault();
    const senhaDigitada = document.getElementById('senha-admin').value;

    if (senhaDigitada === SENHA_MESTRE) {
        secaoLogin.style.display = 'none';
        secaoPainel.style.display = 'block';
    } else {
        alert('Senha incorreta!');
    }
});

formProduto.addEventListener('submit', async function(e) {
    e.preventDefault();

    const produto = {
        nome: document.getElementById('nome-prod').value,
        descricao: document.getElementById('desc-prod').value,
        preco: parseFloat(document.getElementById('preco-prod').value),
        imagem: document.getElementById('imagem-prod').value
    };

    try {
        const resposta = await fetch('https://SUA_URL_DO_PYTHONANYWHERE/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });

        if (resposta.ok) {
            alert('Produto cadastrado com sucesso no banco SQLite!');
            formProduto.reset();
        } else {
            alert('Erro ao comunicar com a API.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Não foi possível ligar à API.');
    }
});

btnSair.addEventListener('click', function() {
    secaoPainel.style.display = 'none';
    secaoLogin.style.display = 'block';
    document.getElementById('senha-admin').value = '';
});