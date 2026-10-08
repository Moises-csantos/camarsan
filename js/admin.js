const SENHA_MESTRE = "12345";
const URL_API = "https://aliancascamarsan1993.pythonanywhere.com/produtos";

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
        carregarProdutosAdmin(); // Carrega a lista ao entrar[cite: 10]
        carregarDepoimentosAdmin(); // Carrega os depoimentos ao entrar
    } else {
        alert('Senha incorreta!');
    }
});

// Variável global para gerir a ordem das imagens antes do envio[cite: 10]
let arquivosSelecionados = [];
const inputImagem = document.getElementById('imagem-prod');

// Criar dinamicamente uma área para pré-visualizar e escolher a capa[cite: 10]
if (inputImagem) {
    const containerPreview = document.createElement('div');
    containerPreview.id = 'preview-imagens-admin';
    containerPreview.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;';
    inputImagem.parentNode.insertBefore(containerPreview, inputImagem.nextSibling);

    inputImagem.addEventListener('change', function (e) {
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

            miniaturaWrapper.addEventListener('click', () => {
                const imagemClicada = arquivosSelecionados.splice(index, 1)[0];
                arquivosSelecionados.unshift(imagemClicada);
                atualizarPreviewImagens();
            });

            containerPreview.appendChild(miniaturaWrapper);
        };
        reader.readAsDataURL(file);
    });
}

// --- FUNÇÃO PARA CARREGAR PRODUTOS NO PAINEL ADMIN ---[cite: 10]
async function carregarProdutosAdmin() {
    const listaDiv = document.getElementById('lista-produtos-admin');
    if (!listaDiv) return;

    listaDiv.innerHTML = '<p>A carregar produtos...</p>';

    try {
        const resposta = await fetch(URL_API);
        const produtos = await resposta.json();

        if (produtos.length === 0) {
            listaDiv.innerHTML = '<p>Nenhum produto cadastrado no momento.</p>';
            return;
        }

        let html = '<h3>Produtos Cadastrados (Gerir)</h3><div style="display: flex; flex-direction: column; gap: 10px;">';

        produtos.forEach(prod => {
            const produtoId = prod.id || prod._id;
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; background: #f9f9f9; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                    <div>
                        <strong>${prod.nome}</strong> - R$ ${parseFloat(prod.preco).toFixed(2)}
                        <br><small style="color: #666;">${prod.material || ''} | ${prod.largura_mm || ''}mm</small>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button type="button" onclick="prepararEdicao('${produtoId}', '${encodeURIComponent(JSON.stringify(prod))}')" style="background: #c9a227; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Editar</button>
                        <button type="button" onclick="excluirProduto('${produtoId}')" style="background: #d9534f; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Excluir</button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        listaDiv.innerHTML = html;

    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
        listaDiv.innerHTML = '<p style="color: red;">Erro ao carregar lista de produtos da API.</p>';
    }
}

// --- FUNÇÃO PARA EXCLUIR PRODUTO ---[cite: 10]
window.excluirProduto = async function(id) {
    if (!confirm('Tem certeza de que deseja excluir este produto?')) return;

    try {
        const resposta = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        });

        if (resposta.ok) {
            alert('Produto excluído com sucesso!');
            carregarProdutosAdmin();
        } else {
            alert('Erro ao excluir o produto.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Não foi possível comunicar com a API para excluir.');
    }
}

// --- FUNÇÃO PARA PREPARAR A EDIÇÃO ---[cite: 10]
window.prepararEdicao = function(id, prodJsonStr) {
    const prod = JSON.parse(decodeURIComponent(prodJsonStr));

    document.getElementById('edit-produto-id').value = id;
    document.getElementById('nome-prod').value = prod.nome || '';
    document.getElementById('desc-prod').value = prod.descricao || '';
    document.getElementById('preco-prod').value = prod.preco || '';
    document.getElementById('largura-mm').value = prod.largura_mm || '';
    document.getElementById('material').value = prod.material || '';
    document.getElementById('acabamento').value = prod.acabamento || '';
    document.getElementById('revestimento').value = prod.revestimento || '';
    document.getElementById('personalizacao').value = prod.personalizacao || '';
    document.getElementById('disponibilidade').value = prod.disponibilidade || '';

    document.getElementById('btn-salvar-prod').innerText = 'Atualizar Produto';
    document.getElementById('btn-cancelar-edicao').style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('btn-cancelar-edicao')?.addEventListener('click', function() {
    formProduto.reset();
    document.getElementById('edit-produto-id').value = '';
    document.getElementById('btn-salvar-prod').innerText = 'Salvar Produto no Banco';
    this.style.display = 'none';
    arquivosSelecionados = [];
    const containerPreview = document.getElementById('preview-imagens-admin');
    if (containerPreview) containerPreview.innerHTML = '';
});

// --- ENVIO DO FORMULÁRIO (CRIAÇÃO OU ATUALIZAÇÃO) ---[cite: 10]
formProduto.addEventListener('submit', async function (e) {
    e.preventDefault();

    const idEdicao = document.getElementById('edit-produto-id').value;
    const isEditando = idEdicao !== '';

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

    arquivosSelecionados.forEach(file => {
        formData.append('imagens', file);
    });

    const urlDestino = isEditando ? `${URL_API}/${idEdicao}` : URL_API;
    const metodoHttp = isEditando ? 'PUT' : 'POST';

    try {
        const resposta = await fetch(urlDestino, {
            method: metodoHttp,
            body: formData
        });

        if (resposta.ok) {
            alert(isEditando ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
            formProduto.reset();
            document.getElementById('edit-produto-id').value = '';
            document.getElementById('btn-salvar-prod').innerText = 'Salvar Produto no Banco';
            document.getElementById('btn-cancelar-edicao').style.display = 'none';
            arquivosSelecionados = [];
            
            const containerPreview = document.getElementById('preview-imagens-admin');
            if (containerPreview) containerPreview.innerHTML = '';
            
            carregarProdutosAdmin();
        } else {
            alert('Erro ao guardar o produto na API.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Não foi possível ligar à API.');
    }
});

// --- BOTÃO SAIR / BLOQUEAR PAINEL ---[cite: 10]
document.addEventListener('click', function (e) {
    if (e.target && (e.target.id === 'btn-sair' || e.target.closest('#btn-sair'))) {
        e.preventDefault();

        if (secaoPainel) secaoPainel.style.display = 'none';
        if (secaoLogin) secaoLogin.style.display = 'block';

        const inputSenha = document.getElementById('senha-admin');
        if (inputSenha) inputSenha.value = '';

        if (formProduto) formProduto.reset();
        document.getElementById('edit-produto-id').value = '';
        document.getElementById('btn-salvar-prod').innerText = 'Salvar Produto no Banco';
        const btnCancelar = document.getElementById('btn-cancelar-edicao');
        if (btnCancelar) btnCancelar.style.display = 'none';
        
        arquivosSelecionados = [];
        const containerPreview = document.getElementById('preview-imagens-admin');
        if (containerPreview) containerPreview.innerHTML = '';
    }
});


// =====================================
// GESTÃO DE DEPOIMENTOS NO PAINEL ADMIN 
// =====================================

const URL_API_DEPOIMENTOS = "https://aliancascamarsan1993.pythonanywhere.com/admin/depoimentos";

async function carregarDepoimentosAdmin() {
    const listaDiv = document.getElementById('lista-depoimentos-admin');
    if (!listaDiv) return;

    listaDiv.innerHTML = '<p>A carregar depoimentos...</p>';

    try {
        const resposta = await fetch(URL_API_DEPOIMENTOS);
        const depoimentos = await resposta.json();

        if (depoimentos.length === 0) {
            listaDiv.innerHTML = '<p>Nenhum depoimento cadastrado no momento.</p>';
            return;
        }

        let html = '<div class="admin-lista-depoimentos">';

        depoimentos.forEach(dep => {
            const idDep = dep.id || dep._id;
            const statusClass = dep.aprovado ? 'badge-aprovado' : 'badge-pendente';
            const statusTexto = dep.aprovado ? 'Aprovado' : 'Pendente';

            html += `
                <div class="admin-depoimento-card">
                    <div class="admin-depoimento-info">
                        <div>
                            <span class="badge-status ${statusClass}">${statusTexto}</span> 
                            <strong>${dep.nome}</strong> (${dep.cidade}) - ${dep.estrelas} ⭐
                        </div>
                        <p>"${dep.mensagem}"</p>
                    </div>
                    <div class="admin-depoimento-acoes">
                        ${!dep.aprovado ? `<button type="button" class="btn-aprovar-admin" onclick="aprovarDepoimento('${idDep}')">Aprovar</button>` : ''}
                        <button type="button" class="btn-excluir-admin" onclick="excluirDepoimento('${idDep}')">Excluir</button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        listaDiv.innerHTML = html;

    } catch (erro) {
        console.error('Erro ao carregar depoimentos:', erro);
        listaDiv.innerHTML = '<p>Erro ao carregar a lista de depoimentos.</p>';
    }
}

window.aprovarDepoimento = async function(id) {
    try {
        const resposta = await fetch(`${URL_API_DEPOIMENTOS}/${id}/aprovar`, {
            method: 'PUT'
        });

        if (resposta.ok) {
            alert('Depoimento aprovado com sucesso!');
            carregarDepoimentosAdmin();
        } else {
            alert('Erro ao aprovar o depoimento.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Não foi possível comunicar com a API.');
    }
}

window.excluirDepoimento = async function(id) {
    if (!confirm('Tem certeza de que deseja excluir permanentemente este depoimento?')) return;

    try {
        const resposta = await fetch(`${URL_API_DEPOIMENTOS}/${id}`, {
            method: 'DELETE'
        });

        if (resposta.ok) {
            alert('Depoimento excluído com sucesso!');
            carregarDepoimentosAdmin();
        } else {
            alert('Erro ao excluir o depoimento.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Não foi possível comunicar com a API para excluir.');
    }
}
