// =====================================================
// CAMARSAN - PÁGINA DE DETALHES DO EVENTO
// =====================================================

const CONFIG_EVENTO = {
    API_URL: "https://aliancascamarsan1993.pythonanywhere.com"
};

document.addEventListener("DOMContentLoaded", () => {
    carregarDetalhesEvento();
});

async function carregarDetalhesEvento() {
    const container = document.getElementById("evento-container");

    if (!container) {
        console.warn("Container do evento não encontrado.");
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const idEvento = parametros.get("id");

    if (!idEvento) {
        container.innerHTML = "<p>Evento não especificado.</p>";
        return;
    }

    try {
        const resposta = await fetch(`${CONFIG_EVENTO.API_URL}/eventos`);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const eventos = await resposta.json();

        // Encontra o evento correspondente ao ID da URL
        const evento = eventos.find(item => String(item.id) === String(idEvento));

        if (!evento) {
            container.innerHTML = "<p>Evento não encontrado.</p>";
            return;
        }

        exibirDetalhesEvento(evento);

    } catch (erro) {
        console.error("Erro ao carregar detalhes do evento:", erro);
        container.innerHTML = "<p>Não foi possível carregar as informações do evento.</p>";
    }
}

function exibirDetalhesEvento(evento) {
    const container = document.getElementById("evento-container");

    // Lógica para renderizar o iframe do mapa se for um link de embed ou gerar link direto do Google Maps
    let mapaHtml = '';
    if (evento.mapa) {
        if (evento.mapa.includes('<iframe')) {
            mapaHtml = `<div style="margin-top:20px; width:100%; border-radius:12px; overflow:hidden;">${evento.mapa}</div>`;
        } else {
            const urlMapa = evento.mapa.startsWith('http') ? evento.mapa : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evento.local)}`;
            mapaHtml = `
                <div style="margin-top: 20px;">
                    <a href="${urlMapa}" target="_blank" rel="noopener noreferrer" class="btn-secundario-catalogo" style="display: inline-block; padding: 10px 18px; font-size: 0.9rem;">
                        📍 Abrir no Google Maps
                    </a>
                </div>
            `;
        }
    } else if (evento.local) {
        const urlBuscaMapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evento.local)}`;
        mapaHtml = `
            <div style="margin-top: 20px;">
                <a href="${urlBuscaMapa}" target="_blank" rel="noopener noreferrer" class="btn-secundario-catalogo" style="display: inline-block; padding: 10px 18px; font-size: 0.9rem;">
                    📍 Ver local no Google Maps
                </a>
            </div>
        `;
    }

    // Botão do Instagram (se preenchido)
    let instagramHtml = '';
    if (evento.instagram) {
        instagramHtml = `
            <div style="margin-top: 15px;">
                <a href="${evento.instagram}" target="_blank" rel="noopener noreferrer" class="btn-secundario-catalogo" style="display: inline-block; padding: 10px 18px; font-size: 0.9rem; background-color: #E1306C; color: #fff; text-decoration: none; border-radius: 6px;">
                    📸 Ver publicação / Perfil no Instagram
                </a>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="produto-galeria">
            <div class="produto-imagem-principal-container">
                <img
                    id="imagem-principal"
                    src="${evento.imagem || '../assets/logo/logo.png'}"
                    alt="${evento.nome || evento.titulo}"
                    class="produto-imagem-principal"
                >
            </div>
        </div>

        <div class="produto-informacoes">
            <span class="evento-data-badge" style="display: inline-block; background-color: rgba(201, 162, 39, 0.15); color: var(--dourado-escuro); font-size: 0.9rem; font-weight: bold; padding: 6px 12px; border-radius: 6px; margin-bottom: 15px;">
                📅 ${evento.data || 'Data a confirmar'}
            </span>

            <h1>${evento.nome || evento.titulo}</h1>

            <p class="produto-descricao" style="margin-top: 15px; line-height: 1.6;">
                ${evento.descricao || 'Sem descrição detalhada para este evento.'}
            </p>

            <div class="produto-caracteristicas" style="margin-top: 20px;">
                <p><strong>📍 Local:</strong> ${evento.local || 'A definir'}</p>
                <p style="margin-top: 8px;"><strong>⏰ Horário:</strong> ${evento.horario || 'A definir'}</p>
            </div>

            <!-- EXIBIÇÃO DO MAPA E INSTAGRAM -->
            ${mapaHtml}
            ${instagramHtml}

            <div style="margin-top: 30px;">
                <a
                    href="#"
                    class="btn-whatsapp"
                    id="evento-whatsapp"
                    target="_blank"
                    rel="noopener noreferrer">
                    Falar conosco sobre este evento
                </a>
            </div>
        </div>
    `;

    // --- CONFIGURAR BOTÃO WHATSAPP DO EVENTO ---
    const btnWhatsapp = document.getElementById("evento-whatsapp");
    if (btnWhatsapp) {
        btnWhatsapp.addEventListener("click", (e) => {
            e.preventDefault();

            const nomeEvento = evento.nome || evento.titulo;
            const dataEvento = evento.data || 'breve';

            let mensagem = `📅 *Consulta sobre Evento - CamarSan*\n\n`;
            mensagem += `Olá! Gostaria de saber mais informações sobre o evento:\n`;
            mensagem += `*${nomeEvento}*\n`;
            mensagem += `Data: ${dataEvento}\n`;
            mensagem += `Local: ${evento.local || 'A definir'}\n\n`;

            // Adiciona o link da imagem se ela existir
            if (evento.imagem) {
                mensagem += `🖼️ Imagem do evento: ${evento.imagem}\n\n`;
            }

            mensagem += `Poderia me dar mais detalhes?`;

            const numeroWhatsApp = "5554996322787";
            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

            window.open(url, "_blank");
        });
    }
}
