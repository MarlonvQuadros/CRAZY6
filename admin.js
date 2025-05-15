// --- Função utilitária para carregar arquivos como DataURL (base64) para preview e armazenamento ---
function lerArquivoComoDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = e => reject(e);
    reader.readAsDataURL(file);
  });
}

// --- Dados iniciais de produtos e roles do localStorage ou array padrão ---
let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let roles = JSON.parse(localStorage.getItem('roles')) || [];

// --- Seletores dos containers no admin.html ---
const listaProdutos = document.getElementById('lista-produtos');
const listaRoles = document.getElementById('lista-roles');

// --- Função para renderizar produtos na lista do admin ---
function renderizarProdutos() {
  listaProdutos.innerHTML = '';
  produtos.forEach(produto => {
    const li = document.createElement('li');
    li.innerHTML = `
      <b>${produto.nome}</b> - R$${produto.preco.toFixed(2)} 
      <button onclick="editarProduto(${produto.id})">Editar</button>
      <button onclick="excluirProduto(${produto.id})">Excluir</button>
    `;
    listaProdutos.appendChild(li);
  });
}

// --- Função para renderizar roles na lista do admin ---
function renderizarRoles() {
  listaRoles.innerHTML = '';
  roles.forEach((role, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <b>Role ${i + 1}:</b> ${role.descricao.substring(0, 40)}... 
      <button onclick="editarRole(${i})">Editar</button>
      <button onclick="excluirRole(${i})">Excluir</button>
    `;
    listaRoles.appendChild(li);
  });
}

// --- Funções para adicionar, editar e excluir produtos ---
function adicionarProduto(produto) {
  produto.id = Date.now();
  produtos.push(produto);
  salvarProdutos();
  renderizarProdutos();
}

function salvarProdutos() {
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

function excluirProduto(id) {
  produtos = produtos.filter(p => p.id !== id);
  salvarProdutos();
  renderizarProdutos();
}

// --- Funções para adicionar, editar e excluir roles ---
function adicionarRole(role) {
  roles.push(role);
  salvarRoles();
  renderizarRoles();
}

function salvarRoles() {
  localStorage.setItem('roles', JSON.stringify(roles));
}

function excluirRole(i) {
  roles.splice(i, 1);
  salvarRoles();
  renderizarRoles();
}

// --- Função para abrir formulário para editar produto ---
function editarProduto(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return alert('Produto não encontrado!');
  
  // Mostrar formulário preenchido para edição
  // Pode criar um modal/form dinâmico ou reutilizar o formulário de adicionar
  // Para simplicidade, vamos preencher os inputs já existentes (exemplo abaixo)
  
  document.getElementById('nome').value = produto.nome;
  document.getElementById('preco').value = produto.preco;
  document.getElementById('produto-id').value = produto.id; // campo hidden para editar
}

// --- Função para salvar edição de produto ---
function salvarEdicaoProduto() {
  const id = parseInt(document.getElementById('produto-id').value);
  const nome = document.getElementById('nome').value;
  const preco = parseFloat(document.getElementById('preco').value);

  if (!nome || isNaN(preco)) return alert('Preencha nome e preço corretamente!');

  const produto = produtos.find(p => p.id === id);
  if (!produto) return alert('Produto não encontrado!');

  produto.nome = nome;
  produto.preco = preco;

  salvarProdutos();
  renderizarProdutos();
  document.getElementById('form-produto').reset();
  document.getElementById('produto-id').value = '';
}

// --- Funções similares para editar roles (abre modal ou formulário) ---
// Aqui, para roles, você precisaria de um formulário com:
// - Campo texto para descrição
// - Upload imagem principal (base64)
// - Upload imagens galeria (array base64)

// --- Exemplo básico para editar role (pode adaptar depois) ---
function editarRole(i) {
  const role = roles[i];
  if (!role) return alert('Role não encontrado!');
  
  document.getElementById('role-index').value = i;
  document.getElementById('role-descricao').value = role.descricao;
  // Aqui você pode mostrar previews das imagens, etc, conforme sua UI
}

// --- Salvar edição de role ---
function salvarEdicaoRole() {
  const i = parseInt(document.getElementById('role-index').value);
  if (isNaN(i)) return alert('Role inválido!');
  
  const descricao = document.getElementById('role-descricao').value;
  if (!descricao) return alert('Descrição é obrigatória!');

  // Para imagens, aqui você precisaria pegar os arquivos do input e convertê-los para base64, atualizar o objeto
  // Exemplo simplificado só atualiza a descrição
  roles[i].descricao = descricao;
  
  salvarRoles();
  renderizarRoles();
  document.getElementById('form-role').reset();
  document.getElementById('role-index').value = '';
}

// --- Quando a página carrega ---
window.onload = () => {
  renderizarProdutos();
  renderizarRoles();
};

// --- Exportar funções para o escopo global para usar nos botões inline ---
window.excluirProduto = excluirProduto;
window.editarProduto = editarProduto;
window.salvarEdicaoProduto = salvarEdicaoProduto;

window.excluirRole = excluirRole;
window.editarRole = editarRole;
window.salvarEdicaoRole = salvarEdicaoRole;
// Função para excluir um role pelo índice
function excluirRole(index) {
  let roles = JSON.parse(localStorage.getItem('roles')) || [];
  if (index >= 0 && index < roles.length) {
    roles.splice(index, 1);
    localStorage.setItem('roles', JSON.stringify(roles));
    carregarRoles();
  }
}

// Função para preencher o formulário com os dados do role que será editado
function editarRole(index) {
  const roles = JSON.parse(localStorage.getItem('roles')) || [];
  if (index >= 0 && index < roles.length) {
    const role = roles[index];
    document.getElementById('role-index').value = index;
    document.getElementById('role-descricao').value = role.descricao;

    // Não podemos preencher os inputs file diretamente por segurança
    // Mas você pode mostrar a imagem atual assim:
    const imgPrincipalPreview = document.getElementById('img-principal-preview');
    if (imgPrincipalPreview) {
      imgPrincipalPreview.src = role.imgPrincipal;
    }

    // Galeria também pode ter um preview se quiser (a implementar)
  }
}

// Função para salvar as alterações do role editado
function salvarEdicaoRole() {
  const index = parseInt(document.getElementById('role-index').value);
  if (isNaN(index)) return alert('Índice inválido para edição');

  const descricao = document.getElementById('role-descricao').value;
  const inputImgPrincipal = document.getElementById('role-img-principal');
  const inputGaleria = document.getElementById('role-img-galeria');

  let roles = JSON.parse(localStorage.getItem('roles')) || [];

  if (index < 0 || index >= roles.length) {
    return alert('Role não encontrado');
  }

  // Atualizar descrição
  roles[index].descricao = descricao;

  // Atualizar imgPrincipal se novo arquivo for enviado
  if (inputImgPrincipal.files && inputImgPrincipal.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      roles[index].imgPrincipal = e.target.result;
      // Depois que a imagem carregar, atualizar galeria se necessário e salvar tudo
      salvarGaleriaEAtualizar(roles, index, inputGaleria);
    };
    reader.readAsDataURL(inputImgPrincipal.files[0]);
  } else {
    // Se não tem imagem principal nova, só atualizar galeria
    salvarGaleriaEAtualizar(roles, index, inputGaleria);
  }
}

function salvarGaleriaEAtualizar(roles, index, inputGaleria) {
  if (inputGaleria.files && inputGaleria.files.length > 0) {
    const galeriaFiles = Array.from(inputGaleria.files);
    const readers = [];

    let imagensGaleria = [];

    galeriaFiles.forEach((file, i) => {
      const reader = new FileReader();
      readers.push(reader);

      reader.onload = function(e) {
        imagensGaleria.push(e.target.result);

        if (imagensGaleria.length === galeriaFiles.length) {
          roles[index].galeria = imagensGaleria;
          localStorage.setItem('roles', JSON.stringify(roles));
          carregarRoles();
          alert('Role atualizado com sucesso!');
          limparFormularioRole();
        }
      };

      reader.readAsDataURL(file);
    });
  } else {
    // Se não mudou galeria, só salvar e atualizar
    localStorage.setItem('roles', JSON.stringify(roles));
    carregarRoles();
    alert('Role atualizado com sucesso!');
    limparFormularioRole();
  }
}

// Função para limpar o formulário após salvar
function limparFormularioRole() {
  document.getElementById('role-index').value = '';
  document.getElementById('role-descricao').value = '';
  document.getElementById('role-img-principal').value = '';
  document.getElementById('role-img-galeria').value = '';

  // Limpar preview se tiver
  const imgPrincipalPreview = document.getElementById('img-principal-preview');
  if (imgPrincipalPreview) {
    imgPrincipalPreview.src = '';
  }
}

