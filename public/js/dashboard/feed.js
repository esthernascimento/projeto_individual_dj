function renderizarMeusPosts() {
    let grade = document.getElementById("grade-posts");
    let idUsuario = sessionStorage.ID_USUARIO;

    fetch(`/posts/meus?idUsuario=${idUsuario}`)
        .then(res => res.json())
        .then(posts => {
            grade.innerHTML = "";

            if (posts.length === 0) {
                grade.innerHTML = '<p style="color: white;">Nenhum post publicado.</p>';
                return;
            }

            for (let i = 0; i < posts.length; i++) {
                let post = posts[i];

                let card = document.createElement("div");
                card.className = "card-post";

                card.innerHTML = `
                    <img src="../assets/uploads/${post.imagemPost}" onerror="this.src='../assets/imgs/dj-default.png'">
                    
                    <div class="corpo-post">
                        <div class="titulo-post">${post.titulo}</div>
                        <div class="descricao-post">${post.conteudo}</div>
                    </div>

                    <div class="rodape-card">
                        <span> ★ ${post.totalCurtidas || 0} Estrelas</span>

                        <span>
                            <img class="img-icone" src="../assets/icon/comentario-icon.png" alt="comentario-icon"> 
                            ${post.totalComentarios || 0} Comentários
                        </span>

                        <button onclick="deletarPost(${post.idPost})">
                            <img class="img-lixo" src="../assets/icon/lixeira-icon.png" alt="lixeira-icon">
                            Apagar post 
                        </button>
                    </div>

                    <div class="lista-comentarios" id="comentarios-${post.idPost}">
                        <small>Carregando comentários...</small>
                    </div>
                `;

                // adiciona no DOM primeiro
                grade.appendChild(card);

                // aq eu chamou a funncao a busca de comentários para esse post específico
                setTimeout(() => {buscarComentarios(post.idPost);}, 0);
            }
        });
}

// Buscar os comentarios
function buscarComentarios(idPost) {
    let container = document.getElementById(`comentarios-${idPost}`);
    if (!container) return; // Segurança extra

    fetch(`/posts/${idPost}/comentarios`)
        .then(res => res.json())
        .then(comentarios => {
            container.innerHTML = "";

            if (comentarios.length === 0) {
                container.innerHTML = '<div class="item-comentario">Nenhum comentário ainda.</div>';
                return;
            }

            for (let j = 0; j < comentarios.length; j++) {
                let coment = comentarios[j];

                let div = document.createElement("div");
                div.className = "item-comentario";
                div.style.display = "flex";
                div.style.justifyContent = "space-between";

                let texto = document.createElement("span");
                texto.innerHTML = `<strong>${coment.autor}:</strong> ${coment.texto}`;

                let botao = document.createElement("button");
                let img = document.createElement("img");
                img.src = "../assets/icon/lixeira-icon.png";
                img.className = "img-lixo";

                botao.appendChild(img);
                botao.onclick = () => deletarComentario(coment.idComentario, idPost);

                div.appendChild(texto);
                div.appendChild(botao);

                container.appendChild(div);
            }
        });
}