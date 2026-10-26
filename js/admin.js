const SENHA_MESTRE = "Nat175907";
const URL_API_BASE = "https://aliancascamarsan1993.pythonanywhere.com";
const URL_API_PRODUTOS = `${URL_API_BASE}/produtos`;
const URL_API_NUMISMATICA = `${URL_API_BASE}/numismatica`;
const URL_API_DEPOIMENTOS = `${URL_API_BASE}/depoimentos`;
const URL_API_ADMIN_DEPOIMENTOS = `${URL_API_BASE}/admin/depoimentos`;

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
        carregarProdutosAdmin();
        carregarNumismaticaAdmin();
        carregarDepoimentosAdmin();
        carregarEventosAdmin();
        inicializarSanfonaAdmin();
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

// --- FUNÇÃO PARA CARREGAR PRODUTOS NO PAINEL ADMIN ---
async function carregarProdutosAdmin() {
    const listaDiv = document.getElementById('lista-produtos-admin');
    if (!listaDiv) return;

    listaDiv.innerHTML = '<p>A carregar produtos...</p>';

    try {
        const resposta = await fetch(URL_API_PRODUTOS);
        const produtos = await resposta.json();

        if (produtos.length === 0) {
            listaDiv.innerHTML = '<p>Nenhum produto cadastrado no momento.</p>';
            return;
        }

        let html = '<h3>Produtos Cadastrados (Gerir)</h3><div style="display: flex; flex-direction: column; gap: 10px;">';

        produtos.forEach(prod => {
            const produtoId = prod.id || prod._id;
            // Pega a primeira imagem disponível ou usa um placeholder se não houver
            const imagemSrc = (prod.imagens && prod.imagens.length > 0) ? prod.imagens[0] : '../assets/logo/logo.png';
            
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; background: #f9f9f9; padding: 12px; border: 1px solid #ddd; border-radius: 8px; gap: 15px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${imagemSrc}" alt="${prod.nome}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 6px; border: 1px solid #ccc; background: #fff;">
                        <div>
                            <strong>${prod.nome}</strong> - R$ ${parseFloat(prod.preco).toFixed(2)}
                            <br><small style="color: #666;">${prod.material || ''} | ${prod.largura_mm || ''}mm</small>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; flex-shrink: 0;">
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

// --- FUNÇÃO PARA EXCLUIR PRODUTO ---
window.excluirProduto = async function (id) {
    if (!confirm('Tem certeza de que deseja excluir este produto?')) return;

    try {
        const resposta = await fetch(`${URL_API_PRODUTOS}/${id}`, {
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

// --- FUNÇÃO PARA PREPARAR A EDIÇÃO ---
window.prepararEdicao = function (id, prodJsonStr) {
    const prod = JSON.parse(decodeURIComponent(prodJsonStr));

    document.getElementById('edit-produto-id').value = id;
    document.getElementById('nome-prod').value = prod.nome || '';
    document.getElementById('desc-prod').value = prod.descricao || '';
    document.getElementById('preco-prod').value = prod.preco || '';
    document.getElementById('largura-mm').value = prod.largura_mm || '';
    document.getElementById('material').value = prod.material || '';
    // --- PREENCHER NOVOS CAMPOS NA EDIÇÃO ---
    document.getElementById('filtro-formato').value = prod.formato || '';
    document.getElementById('filtro-frisos').value = prod.frisos || '';
    document.getElementById('filtro-acabamento-detalhe').value = prod.acabamento || '';
    document.getElementById('filtro-aco').value = prod.aco || '';
    document.getElementById('filtro-finalidade').value = prod.finalidade || '';
    document.getElementById('filtro-tipo-peca').value = prod.tipo || '';
    // ----------------------------------------
    document.getElementById('acabamento').value = prod.acabamento || '';
    document.getElementById('revestimento').value = prod.revestimento || '';
    document.getElementById('personalizacao').value = prod.personalizacao || '';
    document.getElementById('disponibilidade').value = prod.disponibilidade || '';

    document.getElementById('btn-salvar-prod').innerText = 'Atualizar Produto';
    document.getElementById('btn-cancelar-edicao').style.display = 'block';

    // Abre a sanfona de produtos automaticamente ao editar
    document.getElementById('form-produto').closest('.bloco-sanfona')?.classList.add('ativo');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('btn-cancelar-edicao')?.addEventListener('click', function () {
    formProduto.reset();
    document.getElementById('edit-produto-id').value = '';
    document.getElementById('btn-salvar-prod').innerText = 'Salvar Produto no Banco';
    this.style.display = 'none';
    arquivosSelecionados = [];
    const containerPreview = document.getElementById('preview-imagens-admin');
    if (containerPreview) containerPreview.innerHTML = '';
});

// --- ENVIO DO FORMULÁRIO (CRIAÇÃO OU ATUALIZAÇÃO) ---
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
    // --- NOVOS CAMPOS DE FILTRO ---
    formData.append('formato', document.getElementById('filtro-formato').value);
    formData.append('frisos', document.getElementById('filtro-frisos').value);
    formData.append('acabamento', document.getElementById('filtro-acabamento-detalhe').value);
    formData.append('aco', document.getElementById('filtro-aco').value);
    formData.append('finalidade', document.getElementById('filtro-finalidade').value);
    formData.append('tipo', document.getElementById('filtro-tipo-peca').value);
    // -----------------------------
    formData.append('acabamento', document.getElementById('acabamento').value);
    formData.append('revestimento', document.getElementById('revestimento').value);
    formData.append('personalizacao', document.getElementById('personalizacao').value);
    formData.append('disponibilidade', document.getElementById('disponibilidade').value);

    arquivosSelecionados.forEach(file => {
        formData.append('imagens', file);
    });

    const urlDestino = isEditando ? `${URL_API_PRODUTOS}/${idEdicao}` : URL_API_PRODUTOS;
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
let arquivosNumSelecionados = [];
const inputNumImagem = document.getElementById('num-imagens');

if (inputNumImagem) {
    const containerPreviewNum = document.createElement('div');
    containerPreviewNum.id = 'preview-numismatica-admin';
    containerPreviewNum.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;';
    inputNumImagem.parentNode.insertBefore(containerPreviewNum, inputNumImagem.nextSibling);

    inputNumImagem.addEventListener('change', function (e) {
        arquivosNumSelecionados = Array.from(e.target.files);
        atualizarPreviewNumismatica();
    });
}

function atualizarPreviewNumismatica() {
    const containerPreviewNum = document.getElementById('preview-numismatica-admin');
    if (!containerPreviewNum) return;
    containerPreviewNum.innerHTML = '';

    if (arquivosNumSelecionados.length > 0) {
        const aviso = document.createElement('p');
        aviso.style.cssText = 'width: 100%; font-size: 0.85rem; color: #666; margin-bottom: 5px;';
        aviso.innerHTML = '⭐ <strong>Capa actual:</strong> (A primeira imagem com moldura dourada será a capa). Clique noutra para definir como capa:';
        containerPreviewNum.appendChild(aviso);
    }

    arquivosNumSelecionados.forEach((file, index) => {
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
                const imagemClicada = arquivosNumSelecionados.splice(index, 1)[0];
                arquivosNumSelecionados.unshift(imagemClicada);
                atualizarPreviewNumismatica();
            });

            containerPreviewNum.appendChild(miniaturaWrapper);
        };
        reader.readAsDataURL(file);
    });
}
// =====================================================
// LÓGICA DAS SECÇÕES SANFONA (ACCORDION) NO ADMIN
// =====================================================
function inicializarSanfonaAdmin() {
    const botoesHeader = document.querySelectorAll('.btn-sanfona-header');

    botoesHeader.forEach(botao => {
        // Evita duplicar escutadores de evento se a função for chamada mais de uma vez
        botao.replaceWith(botao.cloneNode(true));
    });

    // Re-seleciona os botões clonados para adicionar o evento limpo
    document.querySelectorAll('.btn-sanfona-header').forEach(botao => {
        botao.addEventListener('click', function () {
            const blocoPai = this.closest('.bloco-sanfona');
            blocoPai.classList.toggle('ativo');
        });
    });
}
// --- BOTÃO SAIR / BLOQUEAR PAINEL ---
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

// --- GESTÃO DE DEPOIMENTOS NO ADMIN ---
async function carregarDepoimentosAdmin() {
    const listaDiv = document.getElementById('lista-depoimentos-admin');
    if (!listaDiv) return;

    listaDiv.innerHTML = '<p>A carregar depoimentos...</p>';

    try {
        const resposta = await fetch(URL_API_ADMIN_DEPOIMENTOS);
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

window.aprovarDepoimento = async function (id) {
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

window.excluirDepoimento = async function (id) {
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
// =====================================================
// GESTÃO DE EVENTOS NO PAINEL ADMIN
// =====================================================

const URL_API_EVENTOS = `${URL_API_BASE}/eventos`;
const formEvento = document.getElementById('form-evento');

async function carregarEventosAdmin() {
    const listaDiv = document.getElementById('lista-eventos-admin');
    if (!listaDiv) return;

    listaDiv.innerHTML = '<p>A carregar eventos...</p>';

    try {
        const resposta = await fetch(URL_API_EVENTOS);
        const eventos = await resposta.json();

        if (eventos.length === 0) {
            listaDiv.innerHTML = '<p>Nenhum evento cadastrado no momento.</p>';
            return;
        }

        let html = '<h3>Eventos Cadastrados (Gerir)</h3><div style="display: flex; flex-direction: column; gap: 10px;">';

        eventos.forEach(ev => {
            const eventoId = ev.id;
            // No caso de eventos, se houver imagem guardada
            const imagemSrc = ev.imagem ? ev.imagem : '../assets/logo/logo.png';

            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; background: #f9f9f9; padding: 12px; border: 1px solid #ddd; border-radius: 8px; text-align: left; gap: 15px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${imagemSrc}" alt="${ev.nome}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #ccc; background: #fff;">
                        <div>
                            <strong>${ev.nome}</strong> (${Array.isArray(ev.datas) ? ev.datas.join(', ') : (ev.data || '')})
                            <br><small style="color: #666;">📍 ${ev.local}</small>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; flex-shrink: 0;">
                        <button type="button" onclick="prepararEdicaoEvento('${eventoId}', '${encodeURIComponent(JSON.stringify(ev))}')" style="background: #c9a227; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Editar</button>
                        <button type="button" onclick="excluirEvento('${eventoId}')" style="background: #d9534f; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Excluir</button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        listaDiv.innerHTML = html;

    } catch (erro) {
        console.error('Erro ao carregar eventos:', erro);
        listaDiv.innerHTML = '<p style="color: red;">Erro ao carregar lista de eventos da API.</p>';
    }
}

window.excluirEvento = async function (id) {
    if (!confirm('Tem certeza de que deseja excluir este evento?')) return;

    try {
        const resposta = await fetch(`${URL_API_EVENTOS}/${id}`, {
            method: 'DELETE'
        });

        if (resposta.ok) {
            alert('Evento excluído com sucesso!');
            carregarEventosAdmin();
        } else {
            alert('Erro ao excluir o evento.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Não foi possível comunicar com a API para excluir.');
    }
}
window.prepararEdicaoEvento = function (id, eventoJsonStr) {
    const ev = JSON.parse(decodeURIComponent(eventoJsonStr));

    document.getElementById('edit-evento-id').value = id;
    document.getElementById('evento-nome').value = ev.nome || '';
    document.getElementById('evento-desc').value = ev.descricao || '';
    
    const datasStr = Array.isArray(ev.datas) ? ev.datas.join(', ') : (ev.data || '');
    document.getElementById('evento-datas').value = datasStr;

    document.getElementById('evento-local').value = ev.local || '';
    document.getElementById('evento-mapa').value = ev.mapa || '';
    document.getElementById('evento-instagram').value = ev.instagram || '';
    document.getElementById('evento-horario').value = ev.horario || '';

    document.getElementById('btn-salvar-evento').innerText = 'Atualizar Evento';
    document.getElementById('btn-cancelar-edicao-evento').style.display = 'block';

    // Abre a sanfona de eventos automaticamente ao editar
    document.getElementById('form-evento').closest('.bloco-sanfona')?.classList.add('ativo');

    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

document.getElementById('btn-cancelar-edicao-evento')?.addEventListener('click', function () {
    formEvento.reset();
    document.getElementById('edit-evento-id').value = '';
    document.getElementById('btn-salvar-evento').innerText = 'Salvar Evento no Banco';
    this.style.display = 'none';
});

if (formEvento) {
    formEvento.addEventListener('submit', async function (e) {
        e.preventDefault();

        const idEdicao = document.getElementById('edit-evento-id').value;
        const isEditando = idEdicao !== '';

        const formData = new FormData();
        formData.append('nome', document.getElementById('evento-nome').value);
        formData.append('descricao', document.getElementById('evento-desc').value);
        
        // Envia as datas inseridas no novo input
        formData.append('datas', document.getElementById('evento-datas').value);
        
        formData.append('local', document.getElementById('evento-local').value);
        formData.append('mapa', document.getElementById('evento-mapa').value);
        formData.append('instagram', document.getElementById('evento-instagram').value);
        formData.append('horario', document.getElementById('evento-horario').value);

        const inputImg = document.getElementById('evento-imagem');
        if (inputImg && inputImg.files.length > 0) {
            formData.append('imagem', inputImg.files[0]);
        }

        const urlDestino = isEditando ? `${URL_API_EVENTOS}/${idEdicao}` : URL_API_EVENTOS;
        const metodoHttp = isEditando ? 'PUT' : 'POST';

        try {
            const resposta = await fetch(urlDestino, {
                method: metodoHttp,
                body: formData
            });

            if (resposta.ok) {
                alert(isEditando ? 'Evento atualizado com sucesso!' : 'Evento cadastrado com sucesso!');
                formEvento.reset();
                document.getElementById('edit-evento-id').value = '';
                document.getElementById('btn-salvar-evento').innerText = 'Salvar Evento no Banco';
                document.getElementById('btn-cancelar-edicao-evento').style.display = 'none';
                carregarEventosAdmin();
            } else {
                alert('Erro ao guardar o evento na API.');
            }
        } catch (erro) {
            console.error('Erro:', erro);
            alert('Não foi possível ligar à API.');
        }
    });
}
const formNumismatica = document.getElementById('form-numismatica');

async function carregarNumismaticaAdmin() {
    const listaDiv = document.getElementById('lista-numismatica-admin');
    if (!listaDiv) return;

    listaDiv.innerHTML = '<p>A carregar moedas e notas...</p>';

    try {
        const resposta = await fetch(URL_API_NUMISMATICA);
        const itens = await resposta.json();

        if (itens.length === 0) {
            listaDiv.innerHTML = '<p>Nenhuma peça cadastrada no momento.</p>';
            return;
        }

        let html = '<h3>Peças Cadastradas (Gerir)</h3><div style="display: flex; flex-direction: column; gap: 10px;">';

        itens.forEach(item => {
            const itemId = item.id || item._id;
            const imagemSrc = (item.imagens && item.imagens.length > 0) ? item.imagens[0] : '../assets/logo/logo.png';

            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; background: #f9f9f9; padding: 12px; border: 1px solid #ddd; border-radius: 8px; text-align: left; gap: 15px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${imagemSrc}" alt="${item.nome}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 6px; border: 1px solid #ccc; background: #fff;">
                        <div>
                            <strong>${item.nome}</strong> (${item.tipo}) - R$ ${parseFloat(item.preco).toFixed(2)}
                            <br><small style="color: #666;">Ano: ${item.ano || 'N/D'} | Estado: ${item.estado_conservacao || 'N/D'}</small>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; flex-shrink: 0;">
                        <button type="button" onclick="prepararEdicaoNumismatica('${itemId}', '${encodeURIComponent(JSON.stringify(item))}')" style="background: #c9a227; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Editar</button>
                        <button type="button" onclick="excluirNumismatica('${itemId}')" style="background: #d9534f; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Excluir</button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        listaDiv.innerHTML = html;

    } catch (erro) {
        console.error('Erro ao carregar numismática:', erro);
        listaDiv.innerHTML = '<p style="color: red;">Erro ao carregar lista da API.</p>';
    }
}

window.excluirNumismatica = async function (id) {
    if (!confirm('Tem certeza de que deseja excluir esta peça?')) return;

    try {
        const resposta = await fetch(`${URL_API_NUMISMATICA}/${id}`, {
            method: 'DELETE'
        });

        if (resposta.ok) {
            alert('Peça excluída com sucesso!');
            carregarNumismaticaAdmin();
        } else {
            alert('Erro ao excluir a peça.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Não foi possível comunicar com a API.');
    }
}

window.prepararEdicaoNumismatica = function (id, itemJsonStr) {
    const item = JSON.parse(decodeURIComponent(itemJsonStr));

    document.getElementById('edit-numismatica-id').value = id;
    document.getElementById('num-nome').value = item.nome || '';
    document.getElementById('num-desc').value = item.descricao || '';
    document.getElementById('num-preco').value = item.preco || '';
    document.getElementById('num-tipo').value = item.tipo || 'Moeda';
    document.getElementById('num-ano').value = item.ano || '';
    document.getElementById('num-estado').value = item.estado_conservacao || '';

    document.getElementById('btn-salvar-num').innerText = 'Atualizar Peça';
    document.getElementById('btn-cancelar-edicao-num').style.display = 'block';

    // Abre a sanfona de numismática automaticamente ao editar
    document.getElementById('form-numismatica').closest('.bloco-sanfona')?.classList.add('ativo');

    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

document.getElementById('btn-cancelar-edicao-num')?.addEventListener('click', function () {
    formNumismatica.reset();
    document.getElementById('edit-numismatica-id').value = '';
    document.getElementById('btn-salvar-num').innerText = 'Salvar Peça no Acervo';
    this.style.display = 'none';
    arquivosNumSelecionados = [];
    const containerPreview = document.getElementById('preview-numismatica-admin');
    if (containerPreview) containerPreview.innerHTML = '';
});

if (formNumismatica) {
    formNumismatica.addEventListener('submit', async function (e) {
        e.preventDefault();

        const idEdicao = document.getElementById('edit-numismatica-id').value;
        const isEditando = idEdicao !== '';

        const formData = new FormData();
        formData.append('nome', document.getElementById('num-nome').value);
        formData.append('descricao', document.getElementById('num-desc').value);
        formData.append('preco', document.getElementById('num-preco').value);
        formData.append('tipo', document.getElementById('num-tipo').value);
        formData.append('ano', document.getElementById('num-ano').value);
        formData.append('estado_conservacao', document.getElementById('num-estado').value);

        // Garante que todas as imagens (com a capa na primeira posição) são enviadas
        arquivosNumSelecionados.forEach(file => {
            formData.append('imagens', file);
        });

        const urlDestino = isEditando ? `${URL_API_NUMISMATICA}/${idEdicao}` : URL_API_NUMISMATICA;
        const metodoHttp = isEditando ? 'PUT' : 'POST';

        try {
            const resposta = await fetch(urlDestino, {
                method: metodoHttp,
                body: formData
            });

            if (resposta.ok) {
                alert(isEditando ? 'Peça atualizada com sucesso!' : 'Peça cadastrada com sucesso!');
                formNumismatica.reset();
                document.getElementById('edit-numismatica-id').value = '';
                document.getElementById('btn-salvar-num').innerText = 'Salvar Peça no Acervo';
                document.getElementById('btn-cancelar-edicao-num').style.display = 'none';
                arquivosNumSelecionados = [];

                const containerPreview = document.getElementById('preview-numismatica-admin');
                if (containerPreview) containerPreview.innerHTML = '';

                carregarNumismaticaAdmin();
            } else {
                alert('Erro ao guardar a peça na API.');
            }
        } 
        catch (erro) {
            console.error('Erro:', erro);
            alert('Não foi possível ligar à API.');
        }
    });
}
