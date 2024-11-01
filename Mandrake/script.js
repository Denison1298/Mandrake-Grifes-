// Variável global do carrinho (recuperada do Local Storage se existir)
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função para salvar o carrinho no Local Storage
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

// Atualiza o contador do carrinho com a quantidade total de itens
function atualizarContadorCarrinho() {
    const contadorCarrinho = document.getElementById("contadorCarrinho");
    const totalItems = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    contadorCarrinho.textContent = totalItems;
}

// Adiciona um item ao carrinho (ou aumenta a quantidade se já existir)
function adicionarAoCarrinho(produto, imagem, preco, tamanho) {
    if (!tamanho) {
        alert("Por favor, selecione um tamanho antes de adicionar ao carrinho.");
        return;
    }

    const itemExistente = carrinho.find(item => item.nome === produto && item.tamanho === tamanho);
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        const item = {
            nome: produto,
            imagem: imagem,
            preco: preco,
            tamanho: tamanho,
            quantidade: 1
        };
        carrinho.push(item);
    }
    
    alert(`${produto} (${tamanho}) foi adicionado ao carrinho!`);
    salvarCarrinho();
    atualizarCarrinho();
    console.log("Carrinho:", carrinho);
}

// Função para atualizar visualmente o carrinho na página
function atualizarCarrinho() {
    const listaCarrinho = document.getElementById("listaCarrinho");
    listaCarrinho.innerHTML = "";
    
    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = "<p>O carrinho está vazio.</p>";
        return;
    }

    carrinho.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item-carrinho");
        itemDiv.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}" style="width: 50px; height: 50px;">
            <p>${item.nome} (${item.tamanho}) - R$${item.preco.toFixed(2)} x ${item.quantidade}</p>
            <button onclick="alterarQuantidade('${item.nome}', '${item.tamanho}', 1)">+</button>
            <button onclick="alterarQuantidade('${item.nome}', '${item.tamanho}', -1)">-</button>
            <button onclick="removerItem('${item.nome}', '${item.tamanho}')">Remover</button>
        `;
        listaCarrinho.appendChild(itemDiv);
    });

    const totalCarrinho = document.getElementById("totalCarrinho");
    totalCarrinho.innerHTML = `Total: R$${carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0).toFixed(2)}`;
}

// Função para alterar a quantidade de um item no carrinho
function alterarQuantidade(nome, tamanho, quantidade) {
    const item = carrinho.find(item => item.nome === nome && item.tamanho === tamanho);
    if (item) {
        item.quantidade += quantidade;
        if (item.quantidade <= 0) {
            removerItem(nome, tamanho);
        } else {
            salvarCarrinho();
            atualizarCarrinho();
        }
    }
}

// Função para remover um item específico do carrinho
function removerItem(nome, tamanho) {
    const index = carrinho.findIndex(item => item.nome === nome && item.tamanho === tamanho);
    if (index > -1) {
        carrinho.splice(index, 1);
        salvarCarrinho();
        atualizarCarrinho();
    }
}

// Função para limpar todos os itens do carrinho
function limparCarrinho() {
    carrinho = [];
    localStorage.removeItem('carrinho');
    atualizarContadorCarrinho();
    atualizarCarrinho();
}

// Função para finalizar a compra e gerar mensagem do WhatsApp
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("O carrinho está vazio.");
        return;
    }

    let mensagem = "Olá, gostaria de finalizar a compra dos seguintes itens:\n";
    carrinho.forEach(item => {
        mensagem += `${item.nome} (${item.tamanho}) - R$${item.preco.toFixed(2)} x ${item.quantidade}\n`;
    });

    const opcaoEntrega = document.querySelector('input[name="opcaoEntrega"]:checked');
    if (opcaoEntrega) {
        mensagem += `Opção: ${opcaoEntrega.value}\n`;

        if (opcaoEntrega.value === "entrega") {
            const rua = document.getElementById("rua").value;
            const bairro = document.getElementById("bairro").value;
            const numero = document.getElementById("numero").value;
            const referencia = document.getElementById("referencia").value;
            const cidade = document.getElementById("cidade").value;

            mensagem += `Endereço de Entrega: ${rua}, ${numero}, ${bairro}, ${cidade}\n`;
            if (referencia) {
                mensagem += `Ponto de Referência: ${referencia}\n`;
            }
        }
    }

    mensagem += `Total: R$${carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0).toFixed(2)}`;

    const telefone = "5511999999999"; // Substitua pelo número de WhatsApp da loja
    const urlWhatsApp = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, "_blank");
}

// Carrega o carrinho do Local Storage e adiciona eventos ao carregar a página
window.onload = function() {
    const storedCarrinho = JSON.parse(localStorage.getItem('carrinho'));
    if (storedCarrinho) {
        carrinho = storedCarrinho;
    }
    atualizarContadorCarrinho();
    atualizarCarrinho();
    
    // Adiciona evento para mostrar ou ocultar o endereço com base na seleção
    const opcaoEntregaRadios = document.querySelectorAll('input[name="opcaoEntrega"]');
    opcaoEntregaRadios.forEach(radio => {
        radio.addEventListener('change', toggleEndereco);
    });
};

