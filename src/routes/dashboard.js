const express = require("express");
const router = express.Router();
const database = require("../database/config");

// números
router.get("/numeros", function (req, res) {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM usuario) AS totalUsuarios,
            (SELECT COUNT(*) FROM curtida) AS totalCurtidas
    `;

    database.executar(sql)
        .then(resultado => res.json(resultado[0]))
        .catch(err => res.status(500).send(err));
});

// gêneros
router.get("/generos", function (req, res) {
    const sql = `
        SELECT estiloMusical, COUNT(*) as total
        FROM usuario
        WHERE estiloMusical IS NOT NULL
        GROUP BY estiloMusical
    `;

    database.executar(sql)
        .then(resultado => res.json(resultado))
        .catch(err => res.status(500).send(err));
});

// crescimento dos usuários
router.get("/crescimento", function (req, res) {
    const sql = `
        SELECT 
            MONTH(dtCadastro) AS mes,
            COUNT(*) AS usuarios
        FROM usuario
        GROUP BY MONTH(dtCadastro)
    `;

    database.executar(sql)
        .then(resultado => res.json(resultado))
        .catch(err => res.status(500).send(err));
});

// posts recentes
router.get("/posts-recentes", function (req, res) {
    const sql = `
        SELECT 
            titulo, 
            conteudo, 
            imagemPost, 
            DATE_FORMAT(dtPostagem, '%d/%m/%Y') AS data_post
        FROM post
        ORDER BY dtPostagem DESC
        LIMIT 3
    `;

    database.executar(sql)
        .then(resultado => {
            // Garantimos que resultado seja sempre um array enviando resultado || []
            res.json(resultado || []); 
        })
        .catch(err => {
            console.log("ERRO NA ROTA POSTS RECENTES:", err);
            res.status(500).send(err);
        });
});


router.get("/interacoes", function (req, res) {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM curtida) AS curtidas,
            (SELECT COUNT(*) FROM comentario) AS comentarios
    `;

    database.executar(sql)
        .then(resultado => res.json(resultado[0]))
        .catch(err => res.status(500).send(err));
});


// rota para o post Mais Engajado
router.get("/post-mais-engajado", function (req, res) {
    const sql = `
        SELECT 
            p.idPost,
            p.titulo,
            p.conteudo,
            p.imagemPost,
            DATE_FORMAT(p.dtPostagem, '%d/%m/%Y') AS data,

            COUNT(DISTINCT c.fkUsuario) AS n_curtidas,
            COUNT(DISTINCT cm.idComentario) AS n_comentarios,
            (COUNT(DISTINCT c.fkUsuario) + COUNT(DISTINCT cm.idComentario)) AS engajamento
        FROM post p
        LEFT JOIN curtida c 
            ON c.fkPost = p.idPost
        LEFT JOIN comentario cm 
            ON cm.fkPost = p.idPost

        GROUP BY p.idPost
        ORDER BY engajamento DESC
        LIMIT 1;
    `;

    database.executar(sql)
        .then(resultado => {

            console.log("RESULTADO POST ENGAJADO:", resultado); // DEBUG pra mim ver se foiii
            if (resultado.length > 0) {
                res.json(resultado[0]);
            } else {
                res.status(204).send("Nenhum post encontrado");
            }

        })
        .catch(err => {
            console.log("ERRO NA ROTA:", err);
            res.status(500).send(err);
        });
});

module.exports = router;