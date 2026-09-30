const SENHA_MESTRE = "12345";

const secaoLogin = document.getElementById('secao-login');
const secaoPainel = document.getElementById('secao-painel');
const formLogin = document.getElementById('form-login');
const formProduto = document.getElementById('form-produto');
const btnSair = document.getElementById('btn-sair');

formLogin.addEventListener('submit', function (e) {
    e.preventDefault();
    const senhaDigitada = document.getElementById('senha-admin').value;

    if (senhaDigitada === SENHA_MESTRE) {
        secaoLogin.style.display = 'none';
        secaoPainel.style.display = 'block';
    } else {
        alert('Senha incorreta!');
    }
});

formProduto.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome', document.getElementById('nome-prod').value);
    formData.append('descricao', document.getElementById('desc-prod').value);
    formData.append('preco', document.getElementById('preco-prod').value);

    // Pega o ficheiro selecionado no input file
    const inputImagem = document.getElementById('imagem-prod');
    if (inputImagem.files.length > 0) {
        formData.append('imagem', inputImagem.files[0]);
    }

    try {
        const resposta = await fetch('https://SUA_URL_DO_PYTHONANYWHERE/produtos', {
            method: 'POST',
            // Nota: Quando usamos FormData, NÃO definimos o Content-Type nos headers, 
            // o navegador faz isso automaticamente junto com o envio do arquivo.
            body: formData
        });

        if (resposta.ok) {
            alert('Produto e foto cadastrados com sucesso!');
            formProduto.reset();
        } else {
            alert('Erro ao comunicar com a API.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Não foi possível ligar à API.');
    }
});

btnSair.addEventListener('click', function () {
    secaoPainel.style.display = 'none';
    secaoLogin.style.display = 'block';
    document.getElementById('senha-admin').value = '';
});
