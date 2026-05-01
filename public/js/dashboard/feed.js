function renderizarMeusPosts() {
    const grade = document.getElementById("grade-posts");
    const idUsuario = sessionStorage.ID_USUARIO;

    fetch(`/posts/meus?idUsuario=${idUsuario}`)
        .then(res => res.json())
        .then(posts => {
            grade.innerHTML = "";

            if (posts.length === 0) {
                grade.innerHTML = '<p style="color: white;">Nenhum post publicado.</p>';
                return;
            }

            posts.forEach(post => {
                // aq cria os cards puxando a minha classe do css
                grade.innerHTML += `
                <div class="card-post">
                    <img src="../assets/uploads/${post.imagemPost}" onerror="this.src='../assets/imgs/dj-default.png'">
                    
                    <div class="corpo-post">
                        <div class="titulo-post">${post.titulo}</div>
                        <div class="descricao-post">${post.conteudo}</div>
                    </div>

                    <div class="rodape-card">
                        <span> ★  ${post.totalCurtidas || 0} Estrelas</span>
                        <span>💬 ${post.totalComentarios || 0} Comentários</span>
                    </div>

                    <div class="lista-comentarios" id="comentarios-${post.idPost}">
                        <small style="color: #666">Carregando comentários...</small>
                    </div>
                </div>`;

                // chama a função para buscar os comentários desse post específico
                buscarComentarios(post.idPost);
            });
        });
}

function buscarComentarios(idPost) {
    const container = document.getElementById(`comentarios-${idPost}`);

    fetch(`/posts/${idPost}/comentarios`)
        .then(res => res.json())
        .then(comentarios => {
            if (comentarios.length === 0) {
                container.innerHTML = '<div class="item-comentario">Nenhum comentário ainda.</div>';
                return;
            }

            container.innerHTML = ""; // Limpa o "Carregando..."
            comentarios.forEach(coment => {
                container.innerHTML += `
                    <div class="item-comentario">
                        <strong>${coment.autor}:</strong> ${coment.texto}
                    </div>
                `;
            });
        })
        .catch(() => {
            container.innerHTML = ""; // Se der erro, fica vazio
        });
}