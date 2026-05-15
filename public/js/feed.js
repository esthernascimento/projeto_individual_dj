let estrelados = {};

function renderizarPosts() {
  let idUsuario = sessionStorage.ID_USUARIO;

  // busca os posts passando pelo id dele e para saber o que já curtimos
  fetch(`/posts/listar?idUsuario=${idUsuario}`)
    .then(res => res.json())
    .then(posts => {
      let grade = document.getElementById("grade-posts");
      grade.innerHTML = "";

      if (!posts || posts.length === 0) {
        grade.innerHTML = '<p class="sem-posts">Nenhum post ainda.</p>';
        return;
      }

      for (let i = 0; i < posts.length; i++) {
        let post = posts[i]; // Pega o post atual pelo índice i

        // aq define se o post já vai vir estrelado ou não vindo do banco
        estrelados[post.idPost] = post.jaCurtiu > 0;

        let card = document.createElement("div");
        card.className = "card-post";

        let corEstrela = estrelados[post.idPost] ? "gold" : "white";

        card.innerHTML = `
          <img src="../assets/uploads/${post.imagemPost}" onerror="this.src='../assets/imgs/dj-default.png'">

          <div class="corpo-post">
            <div class="titulo-post">${post.titulo}</div>
            <div class="descricao-post">${post.conteudo}</div>
            <small>Por: ${post.nome} | ★ ${post.totalCurtidas || 0}</small>
          </div>

          <div class="acoes-post">
            <button class="botao-acao" id="estrela-${post.idPost}" 
                    onclick="alternarEstrela(${post.idPost})" 
                    style="color: ${corEstrela}">
              ★ Estrelar
            </button>

            <button class="botao-acao" onclick="alternarComentarios(${post.idPost})">
               <img class="img-icone" src="../assets/icon/comentario-icon.png"> Comentários
            </button>
          </div>

          <div class="secao-comentarios" id="comentarios-${post.idPost}">
            <div id="lista-comentarios-${post.idPost}" class="lista-comentarios-container"></div>

            <div class="linha-comentario">
                <input class="input-comentario" id="input-${post.idPost}" placeholder="Comentar...">
                <button class="botao-enviar" onclick="enviarComentario(${post.idPost})">➤</button>
            </div>
          </div>
        `;

        grade.appendChild(card);
      } // fim do meu for
    })
    .catch(err => {
        console.error("Erro ao renderizar posts:", err);
    });
}

function alternarEstrela(idPost) {
  let idUsuario = Number(sessionStorage.ID_USUARIO);
  if (!idUsuario) return alert("Faça login para estrelar!");

  estrelados[idPost] = !estrelados[idPost];

  fetch(`/posts/${idPost}/curtir`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ curtir: estrelados[idPost], idUsuario: idUsuario })
  })
  .then(res => {
    if (res.ok) {
        let botao = document.getElementById("estrela-" + idPost);
        botao.style.color = estrelados[idPost] ? "gold" : "white";
  
        renderizarPosts(); 
    }
  });
}

function alternarComentarios(idPost) {
  let secao = document.getElementById("comentarios-" + idPost);
  secao.classList.toggle("aberta");
  if (secao.classList.contains("aberta")) buscarComentarios(idPost);
}

function enviarComentario(idPost) {
  let input = document.getElementById("input-" + idPost);
  let texto = input.value.trim();
  let idUsuario = Number(sessionStorage.ID_USUARIO);

  if (!texto) return;

  fetch(`/posts/${idPost}/comentarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto: texto, idUsuario: idUsuario })
  })
  .then(() => {
    input.value = "";
    buscarComentarios(idPost);
  });
}

function buscarComentarios(idPost) {
  let lista = document.getElementById(`lista-comentarios-${idPost}`);
  
  fetch(`/posts/${idPost}/comentarios`)
    .then(res => res.json())
    .then(comentarios => {
      lista.innerHTML = "";

      if (comentarios.length === 0) {
        lista.innerHTML = "<small class='sem-comentarios'>Nenhum comentário ainda.</small>";
        return;
      }

      for (let k = 0; k < comentarios.length; k++) {
        let c = comentarios[k];
        
        lista.innerHTML += `
          <div class="item-comentario">
            <strong>${c.autor}:</strong> ${c.texto}
          </div>`;
      }
    });
}


