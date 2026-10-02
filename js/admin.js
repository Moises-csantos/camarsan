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
        carregarProdutosAdmin(); // Carrega a lista de produtos ao entrar no painel
    } else {
        alert('Senha incorreta!');
    }
});

// Variável global para gerir a ordem das imagens antes do envio
let arquivosSelecionados = [];

const inputImagem = document.getElementById('imagem-prod');

// Criar dinamicamente uma área para pré-visualizar e escolher a capa
if (inputImagem) {
    const containerPreview = document.createElement('div');
    containerPreview.id = 'preview-imagens-admin';
    containerPreview.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;';
    inputImagem.parentNode.insertBefore(containerPreview, inputImagem.nextSibling);

    inputImagem.addEventListener('change', function (e) {
        // Converte a lista de ficheiros num array manipulável
        arquivosSelecionados = Array.from(e.target.files);
        atualizarPreviewImagens();
    });
}

function atualizarPreviewImagens() {
    const containerPreview = document.getElementById('preview-imagens-admin');
    if (!containerPreview) return;
    containerPreview.innerHTML = '';

    if (arquivosSelecionados.length > 0) {
        const aviso = document.createElement('p');
        aviso.style.cssText = 'width: 100%; font-size: 0.85rem; color: #666; margin-bottom: 5px;';
        aviso.innerHTML = '⭐ <strong>Capa actual:</strong> (A primeira imagem com moldura dourada será a capa). Clique noutra para definir como capa:';
        containerPreview.appendChild(aviso);
    }

    arquivosSelecionados.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const miniaturaWrapper = document.createElement('div');
            // A primeira imagem do array é a capa (destacada com borda dourada)
            const ehCapa = index === 0;
            
            miniaturaWrapper.style.cssText = `
                position: relative;
                width: 70px;
                height: 70px;
                border: 3px solid ${ehCapa ? 'var(--dourado, #c9a227)' : 'transparent'};
                border-radius: 8px;
                overflow: hidden;
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: transform 0.2s;
            `;

            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';
            miniaturaWrapper.appendChild(img);

            if (ehCapa) {
                const badge = document.createElement('span');
                badge.innerText = 'CAPA';
                badge.style.cssText = 'position: absolute; bottom: 0; left: 0; right: 0; background: rgba(201,162,39,0.9); color: #1d1d1d; font-size: 9px; font-weight: bold; text-align: center;';
                miniaturaWrapper.appendChild(badge);
            }

            // Ao clicar numa imagem, ela passa a ser a primeira (capa)
            miniaturaWrapper.addEventListener('click', () => {
                const imagemClicada = arquivosSelecionados.splice(index, 1)[0];
                arquivosSelecionados.unshift(imagemClicada); // Move para a primeira posição
                atualizarPreviewImagens(); // Redesenha as miniaturas
            });

            containerPreview.appendChild(miniaturaWrapper);
        };
        reader.readAsDataURL(file);
    });
}

// Envio do formulário com os arquivos ordenados
formProduto.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome', document.getElementById('nome-prod').value);
    formData.append('descricao', document.getElementById('desc-prod').value);
    formData.append('preco', document.getElementById('preco-prod').value);

    formData.append('largura_mm', document.getElementById('largura-mm').value);
    formData.append('material', document.getElementById('material').value);
    formData.append('acabamento', document.getElementById('acabamento').value);
    formData.append('revestimento', document.getElementById('revestimento').value);
    formData.append('personalizacao', document.getElementById('personalizacao').value);
    formData.append('disponibilidade', document.getElementById('disponibilidade').value);

    // Envia os ficheiros respeitando a ordem escolhida (o primeiro é a capa)
    arquivosSelecionados.forEach(file => {
        formData.append('imagens', file);
    });

    try {
        const resposta = await fetch('https://aliancascamarsan1993.pythonanywhere.com/produtos', {
            method: 'POST',
            body: formData
        });

        if (resposta.ok) {
            alert('Produto cadastrado com sucesso!');
            formProduto.reset();
            arquivosSelecionados = [];
            const containerPreview = document.getElementById('preview-imagens-admin');
            if (containerPreview) containerPreview.innerHTML = '';
            carregarProdutosAdmin();
        } else {
            alert('Erro ao comunicar com a API.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Não foi possível ligar à API.');
    }
});
// --- BOTÃO SAIR / BLOQUEAR PAINEL (VERSÃO SEGURA) ---
document.addEventListener('click', function (e) {
    // Verifica se o elemento clicado é o botão sair (mesmo que seja gerido dinamicamente)
    if (e.target && (e.target.id === 'btn-sair' || e.target.closest('#btn-sair'))) {
        e.preventDefault();

        // Esconde o painel e mostra a tela de login
        if (secaoPainel) secaoPainel.style.display = 'none';
        if (secaoLogin) secaoLogin.style.display = 'block';

        // Limpa a senha
        const inputSenha = document.getElementById('senha-admin');
        if (inputSenha) inputSenha.value = '';

        // Limpa formulários e pré-visualizações
        if (formProduto) formProduto.reset();
        arquivosSelecionados = [];

        const containerPreview = document.getElementById('preview-imagens-admin');
        if (containerPreview) containerPreview.innerHTML = '';
    }
});
