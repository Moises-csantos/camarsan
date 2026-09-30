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

formProduto.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome', document.getElementById('nome-prod').value);
    formData.append('descricao', document.getElementById('desc-prod').value);
    formData.append('preco', document.getElementById('preco-prod').value);

    // Adicionar as novas especificações da aliança
    formData.append('largura_mm', document.getElementById('largura-mm').value);
    formData.append('material', document.getElementById('material').value);
    formData.append('acabamento', document.getElementById('acabamento').value);
    formData.append('revestimento', document.getElementById('revestimento').value);
    formData.append('personalizacao', document.getElementById('personalizacao').value);
    formData.append('disponibilidade', document.getElementById('disponibilidade').value);

    // Pega todos os ficheiros selecionados no input file
    const inputImagem = document.getElementById('imagem-prod');
    for (let i = 0; i < inputImagem.files.length; i++) {
        formData.append('imagens', inputImagem.files[i]);
    }

    try {
        const resposta = await fetch('https://aliancascamarsan1993.pythonanywhere.com/produtos', {
            method: 'POST',
            body: formData
        });

        if (resposta.ok) {
            alert('Produto, foto e especificações cadastrados com sucesso!');
            formProduto.reset();
            carregarProdutosAdmin(); // Atualiza a lista na tela
        } else {
            alert('Erro ao comunicar com a API.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Não foi possível ligar à API.');
    }
});

// Função para listar os produtos no painel administrativo com opção de excluir
async function carregarProdutosAdmin() {
    const containerLista = document.getElementById('lista-produtos-admin');
    if (!containerLista) return;

    try {
        const resposta = await fetch('https://aliancascamarsan1993.pythonanywhere.com/produtos');
        const produtos = await resposta.json();

        containerLista.innerHTML = '';

        if (produtos.length === 0) {
            containerLista.innerHTML = '<p>Nenhum produto cadastrado.</p>';
            return;
        }

        produtos.forEach(produto => {
            const itemDiv = document.createElement('div');
            itemDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: #f9f9f9; padding: 10px; margin-bottom: 8px; border-radius: 5px; border: 1px solid #ddd;';

            itemDiv.innerHTML = `
                <span><strong>${produto.nome}</strong> - R$ ${produto.preco.toFixed(2)}</span>
                <button type="button" class="btn-excluir" data-id="${produto.id}" style="background: #d9534f; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Excluir</button>
            `;

            containerLista.appendChild(itemDiv);
        });

        // Adicionar eventos aos botões de excluir
        document.querySelectorAll('.btn-excluir').forEach(botao => {
            botao.addEventListener('click', async (e) => {
                const idProduto = e.target.dataset.id;

                if (confirm('Tem a certeza que deseja excluir este produto?')) {
                    try {
                        const res = await fetch(`https://aliancascamarsan1993.pythonanywhere.com/produtos/${idProduto}`, {
                            method: 'DELETE'
                        });

                        if (res.ok) {
                            alert('Produto excluído com sucesso!');
                            carregarProdutosAdmin(); // Recarrega a lista
                        } else {
                            alert('Erro ao excluir o produto.');
                        }
                    } catch (err) {
                        console.error('Erro na requisição de exclusão:', err);
                    }
                }
            });
        });

    } catch (erro) {
        console.error('Erro ao carregar produtos para a administração:', erro);
    }
}

btnSair.addEventListener('click', function () {
    secaoPainel.style.display = 'none';
    secaoLogin.style.display = 'block';
    document.getElementById('senha-admin').value = '';
});
