// Array de produtos exemplo
const produtos = [
  { id: 1, nome: "Spray Vermelho", preco: 30, img: "imagens/spray-vermelho.jpg" },
  { id: 2, nome: "Máscara Grafite", preco: 20, img: "imagens/mascara-grafite.jpg" },
  { id: 3, nome: "Camisa Crazy Six", preco: 50, img: "imagens/camisa.jpg" }
];

// Carregar produtos na página (exemplo de listagem)
function carregarProdutos() {
  const container = document.getElementById('produtos-container');
  container.innerHTML = '';
  produtos.forEach(prod => {
    const div = document.createElement('div');
    div.classList.add('produto');
    div.innerHTML = `
      <img src="${prod.img}" alt="${prod.nome}" />
      <h3>${prod.nome}</h3>
      <p>R$ ${prod.preco.toFixed(2)}</p>
      <button onclick="adicionarAoCarrinho(${prod.id})">Adicionar ao Carrinho</button>
    `;
    container.appendChild(div);
  });
}

// Adicionar produto no carrinho (localStorage)
function adicionarAoCarrinho(id) {
  let carrinho = JSON.parse(localStorage.getItem('cart')) || [];
  const produto = produtos.find(p => p.id === id);
  if (produto) {
    carrinho.push(produto);
    localStorage.setItem('cart', JSON.stringify(carrinho));
    alert(`${produto.nome} adicionado ao carrinho!`);
    atualizarContadorCarrinho();
  }
}

// Mostrar itens no carrinho
function mostrarCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('cart')) || [];
  const carrinhoDiv = document.getElementById('carrinho');
  carrinhoDiv.innerHTML = '';
  if (carrinho.length === 0) {
    carrinhoDiv.textContent = "Seu carrinho está vazio.";
    return;
  }
  carrinho.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('item-carrinho');
    div.innerHTML = `
      <img src="${item.img}" alt="${item.nome}" />
      <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
      <button onclick="removerDoCarrinho(${index})">Remover</button>
    `;
    carrinhoDiv.appendChild(div);
  });
}

// Remover item do carrinho por índice
function removerDoCarrinho(index) {
  let carrinho = JSON.parse(localStorage.getItem('cart')) || [];
  carrinho.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(carrinho));
  mostrarCarrinho();
  atualizarContadorCarrinho();
}

// Limpar carrinho
function limparCarrinho() {
  localStorage.removeItem('cart');
  mostrarCarrinho();
  atualizarContadorCarrinho();
}

// Atualizar contador no ícone
function atualizarContadorCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('cart')) || [];
  const countSpan = document.getElementById('cart-count');
  if(countSpan) countSpan.textContent = carrinho.length;
}

// Eventos
document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();
  mostrarCarrinho();
  atualizarContadorCarrinho();

  const limparBtn = document.getElementById('clear-cart');
  if (limparBtn) limparBtn.addEventListener('click', limparCarrinho);
});
