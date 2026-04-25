const posts = [];

// Guarda as estrelas e comentários de cada post
const estrelados = {};
const comentarios = {};

function renderizarPosts() {
  fetch("/posts/listar")
    .then(res => res.json())
    .then(posts => {
      const grade = document.getElementById("grade-posts");
      grade.innerHTML = "";

      if (posts.length === 0) {
        grade.innerHTML = '<p class="sem-posts">Nenhum post ainda.</p>';
        return;
      }

      posts.forEach(post => {
        estrelados[post.idPost] = false;
        comentarios[post.idPost] = [];

        const card = document.createElement("div");
        card.className = "card-post";

        card.innerHTML = `
          <img src="/assets/uploads/${post.imagemPost}">

          <div class="corpo-post">
            <div class="titulo-post">${post.titulo}</div>
            <div class="descricao-post">${post.conteudo}</div>
            <small>Por: ${post.nome}</small>
          </div>

          <div class="acoes-post">
            <button class="botao-acao" onclick="alternarEstrela(${post.idPost})">
              ★ Estrelar
            </button>

            <button class="botao-acao" onclick="alternarComentarios(${post.idPost})">
              💬 Comentar
            </button>
          </div>

          <div class="secao-comentarios" id="comentarios-${post.idPost}">
            <div id="lista-comentarios-${post.idPost}">
              <p class="sem-comentarios">Nenhum comentário ainda.</p>
            </div>

            <div class="linha-comentario">
              <input
                class="input-comentario"
                id="input-${post.idPost}"
                placeholder="Escreva um comentário..."
                onkeydown="if(event.key === 'Enter') enviarComentario(${post.idPost})"
              >
              <button class="botao-enviar" onclick="enviarComentario(${post.idPost})">➤</button>
            </div>
          </div>
        `;

        grade.appendChild(card);
      });
    });
}


function alternarEstrela(id) {
  const post = posts.find(p => p.id === id);
  estrelados[id] = !estrelados[id];

  post.estrelas += estrelados[id] ? 1 : -1;

  document.getElementById("icone-" + id).style.color = estrelados[id] ? "#f5c518" : "white";
  document.getElementById("contador-" + id).textContent = "(" + post.estrelas + ")";
}

function alternarComentarios(id) {
  const secao = document.getElementById("comentarios-" + id);
  secao.classList.toggle("aberta");

  if (secao.classList.contains("aberta")) {
    document.getElementById("input-" + id).focus();
  }
}

function enviarComentario(id) {
  const input = document.getElementById("input-" + id);
  const texto = input.value.trim();
  if (!texto) return;

  comentarios[id].push(texto);
  input.value = "";
  renderizarComentarios(id);
}

function renderizarComentarios(id) {
  const lista = document.getElementById("lista-comentarios-" + id);

  if (comentarios[id].length === 0) {
    lista.innerHTML = '<p class="sem-comentarios">Nenhum comentário ainda.</p>';
    return;
  }

  lista.innerHTML = comentarios[id]
    .map(texto => `<div class="item-comentario"><strong>Você:</strong> ${texto}</div>`)
    .join("");
}

//renderizarPosts();