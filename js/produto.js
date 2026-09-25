// =====================================================
// CAMARSAN - PÁGINA DE PRODUTO
// =====================================================

const CONFIG_PRODUTO = {
    API_URL: "https://aliancascamarsan1993.pythonanywhere.com"
};


// -----------------------------------------------------
// INICIALIZAÇÃO
// -----------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    carregarProduto();
});


// -----------------------------------------------------
// CARREGAR PRODUTO
// -----------------------------------------------------

async function carregarProduto() {

    const container = document.querySelector("#produto-container");

    if (!container) {
        console.warn("Container do produto não encontrado.");
        return;
    }


    const parametros = new URLSearchParams(
        window.location.search
    );

    const idProduto = parametros.get("id");


    if (!idProduto) {

        container.innerHTML = `
            <p>Produto não especificado.</p>
        `;

        return;
    }


    try {

        const resposta = await fetch(
            `${CONFIG_PRODUTO.API_URL}/produtos`
        );


        if (!resposta.ok) {
            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );
        }


        const produtos = await resposta.json();


        const produto = produtos.find(
            item => String(item.id) === String(idProduto)
        );


        if (!produto) {

            container.innerHTML = `
                <p>Produto não encontrado.</p>
            `;

            return;
        }


        exibirProduto(produto);


    } catch (erro) {

        console.error(
            "Erro ao carregar produto:",
            erro
        );


        container.innerHTML = `
            <p>
                Não foi possível carregar o produto.
            </p>
        `;
    }
}


// -----------------------------------------------------
// EXIBIR PRODUTO
// -----------------------------------------------------

function exibirProduto(produto) {

    const container =
        document.querySelector("#produto-container");


    container.innerHTML = `

        <div class="produto-galeria">

            <div class="produto-imagem-principal-container">

                <img
                    id="imagem-principal"
                    src="${produto.imagens[0]}"
                    alt="${produto.nome}"
                    class="produto-imagem-principal"
                >

            </div>


            <div class="produto-miniaturas">

                ${produto.imagens.map((imagem, index) => `

                    <button
                        type="button"
                        class="miniatura ${index === 0 ? "ativa" : ""}"
                        data-imagem="${imagem}"
                        aria-label="Ver imagem ${index + 1}"
                    >

                        <img
                            src="${imagem}"
                            alt="${produto.nome} - imagem ${index + 1}"
                        >

                    </button>

                `).join("")}

            </div>

        </div>


        <div class="produto-informacoes">

            <p class="produto-categoria">
                Aliança CamarSan
            </p>


            <h1>
                ${produto.nome}
            </h1>


            <p class="produto-descricao">
                ${produto.descricao}
            </p>


            <div class="produto-caracteristicas">

                <p>
                    <strong>Largura:</strong>
                    ${produto.largura_mm} mm
                </p>

                <p>
                    <strong>Material:</strong>
                    ${produto.material}
                </p>

                <p>
                    <strong>Acabamento:</strong>
                    ${produto.acabamento}
                </p>

                <p>
                    <strong>Revestimento:</strong>
                    ${produto.revestimento}
                </p>

                <p>
                    <strong>Personalização:</strong>
                    ${produto.personalizacao}
                </p>

            </div>


            <p class="produto-preco">
                R$ ${produto.preco.toFixed(2).replace(".", ",")}
            </p>


            <p class="produto-disponibilidade">
                ${produto.disponibilidade}
            </p>


            <a
                href="#"
                class="btn-whatsapp"
                id="produto-whatsapp">

                Quero saber mais

            </a>

        </div>

    `;


    inicializarGaleria(produto);
}


// -----------------------------------------------------
// GALERIA
// -----------------------------------------------------

function inicializarGaleria(produto) {

    const imagemPrincipal =
        document.querySelector("#imagem-principal");

    const miniaturas =
        document.querySelectorAll(".miniatura");


    miniaturas.forEach((miniatura) => {

        miniatura.addEventListener("click", () => {

            const novaImagem =
                miniatura.dataset.imagem;


            imagemPrincipal.src = novaImagem;


            miniaturas.forEach((item) => {
                item.classList.remove("ativa");
            });


            miniatura.classList.add("ativa");
        });

    });
}
