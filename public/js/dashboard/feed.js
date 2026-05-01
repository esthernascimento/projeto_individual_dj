// Para listar os posts que eu ADM fiz
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

                const card = document.createElement("div");
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

                // 👉 adiciona no DOM primeiro
                grade.appendChild(card);

                // 👉 depois busca comentários (AGORA FUNCIONA)
                setTimeout(() => {
                    buscarComentarios(post.idPost);
                }, 0);

            });
        });
}

// Buscar os comentarios
function buscarComentarios(idPost) {
    const container = document.getElementById(`comentarios-${idPost}`);
    const idUsuarioLogado = Number(sessionStorage.ID_USUARIO);

    fetch(`/posts/${idPost}/comentarios`)
        .then(res => res.json())
        .then(comentarios => {

            container.innerHTML = "";

            if (comentarios.length === 0) {
                container.innerHTML = '<div class="item-comentario">Nenhum comentário ainda.</div>';
                return;
            }

            comentarios.forEach(coment => {

                const div = document.createElement("div");
                div.className = "item-comentario";
                div.style.display = "flex";
                div.style.justifyContent = "space-between";

                const texto = document.createElement("span");
                texto.innerHTML = `<strong>${coment.autor}:</strong> ${coment.texto}`;

                const botao = document.createElement("button");
                const img = document.createElement("img");
                img.src = "../assets/icon/lixeira-icon.png";
                img.className = "img-lixo";

                botao.appendChild(img);
                botao.onclick = () => deletarComentario(coment.idComentario, idPost);

                div.appendChild(texto);
                div.appendChild(botao);

                container.appendChild(div);
            });
        });
}

// Função para excluir comentários
function deletarComentario(idComentario, idPost) {
    const idUsuario = sessionStorage.ID_USUARIO;
    const tipoUsuario = sessionStorage.TIPO_USUARIO;

    console.log("CLICOU DELETE", idComentario);

    if (!confirm("Tem certeza que deseja apagar?")) return;

    fetch(`/posts/comentarios/${idComentario}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idUsuario,
            tipoUsuario
        })
    })
        .then(() => {
            buscarComentarios(idPost);
        })
        .catch(err => console.error(err));
}

// Função para deletar o posttttt 
function deletarPost(idPost) {
    const idUsuario = sessionStorage.ID_USUARIO;

    if (!confirm("Tem certeza que deseja apagar esse post?")) return;

    fetch(`/posts/${idPost}?idUsuario=${idUsuario}`, {
        method: "DELETE"
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao deletar");
            alert("Post apagado!");
            renderizarMeusPosts();
        })
        .catch(err => console.error("Erro:", err));
}

