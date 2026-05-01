var express = require("express");
var router = express.Router();
var database = require("../database/config");
const upload = require("../config/upload");

// Listar TODOS os posts (feed do usuário comum)
router.get("/listar", function (req, res) {
    const idUsuario = req.query.idUsuario; // Pegamos o ID de quem está vendo o feed

    const sql = `
        SELECT 
            p.*, 
            u.nome,
            (SELECT COUNT(*) FROM curtida WHERE fkPost = p.idPost) AS totalCurtidas,
            -- Esta linha abaixo retorna 1 se você já curtiu, 0 se não.
            (SELECT COUNT(*) FROM curtida WHERE fkPost = p.idPost AND fkUsuario = ${idUsuario}) AS jaCurtiu
        FROM post p
        JOIN usuario u ON p.fkAdmin = u.idUsuario
        ORDER BY p.dtPostagem DESC
    `;

    database.executar(sql)
        .then(resultado => res.json(resultado))
        .catch(err => {
            console.log("ERRO:", err);
            res.status(500).send(err);
        });
});

// Lista os posts do admin logado no feed da dash
router.get("/meus", function (req, res) {
    const idAdmin = req.query.idUsuario; 

    if (!idAdmin) {
        return res.status(400).json({ erro: "ID não fornecido" });
    }

    const sql = `
        SELECT p.*, u.nome,
            (SELECT COUNT(*) FROM curtida WHERE fkPost = p.idPost) AS totalCurtidas,
            (SELECT COUNT(*) FROM comentario WHERE fkPost = p.idPost) AS totalComentarios
        FROM post p
        JOIN usuario u ON p.fkAdmin = u.idUsuario
        WHERE p.fkAdmin = ${idAdmin}
        ORDER BY p.dtPostagem DESC
    `;

    database.executar(sql)
        .then(resultado => {
            res.json(resultado || []); 
        })
        .catch(err => {
            console.log("ERRO NO BANCO:", err);
            res.status(500).json(err);
        });
});

// Publicar POST 
router.post("/publicar", upload.single("imagem"), function (req, res) {
    const { titulo, conteudo, fkAdmin } = req.body;

    if (!req.file) {
        return res.status(400).send("Imagem não enviada");
    }

    const imagem = req.file.filename;

    const sql = `
        INSERT INTO post (titulo, conteudo, imagemPost, fkAdmin)
        VALUES ('${titulo}', '${conteudo}', '${imagem}', ${fkAdmin})
    `;

    database.executar(sql)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log("ERRO:", err);
            res.status(500).send(err);
        });
});

// Listar comentários de um post 
router.get("/:id/comentarios", function (req, res) {
    const idPost = req.params.id;
    const sql = `
        SELECT 
            co.idComentario,
            co.comentarioDescricao AS texto,
            co.fkUsuario, 
            u.nome AS autor,
            co.dtComentario
        FROM comentario co
        JOIN usuario u ON co.fkUsuario = u.idUsuario
        WHERE co.fkPost = ${idPost}
          AND co.statusComentario = 1
        ORDER BY co.dtComentario ASC
    `;
    database.executar(sql)
        .then(resultado => res.json(resultado))
        .catch(err => res.status(500).send(err));
});

// Rota para Comentar 
router.post("/:id/comentarios", function (req, res) {
    const idPost = req.params.id;
    let texto = req.body.texto;
    let idUsuario = req.body.idUsuario;

    if (!idUsuario) {
        return res.status(401).send("Usuário não identificado");
    }

    const sql = `
        INSERT INTO comentario (fkUsuario, fkPost, comentarioDescricao, statusComentario)
        VALUES (${idUsuario}, ${idPost}, '${texto}', 1)
    `;

    database.executar(sql)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log("Erro ao comentar:", err);
            res.status(500).send(err);
        });
});

// Rota para Curtir 
router.post("/:id/curtir", function (req, res) {
    const idPost = req.params.id;
    let curtir = req.body.curtir;
    let idUsuario = req.body.idUsuario;

    if (!idUsuario) {
        return res.status(401).send("Usuário não identificado");
    }

    const sql = curtir
        ? `INSERT IGNORE INTO curtida (fkUsuario, fkPost) VALUES (${idUsuario}, ${idPost})`
        : `DELETE FROM curtida WHERE fkUsuario = ${idUsuario} AND fkPost = ${idPost}`;

    database.executar(sql)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log("Erro ao curtir:", err);
            res.status(500).send(err);
        });
});

// apagar comentario
router.delete("/comentarios/:id", function (req, res) {
    const idComentario = req.params.id;
    const { idUsuario, tipoUsuario } = req.body;

    if (!idUsuario) {
        return res.status(401).send("Usuário não identificado");
    }

    const sql = tipoUsuario === "Administrador"
        ? `DELETE FROM comentario WHERE idComentario = ${idComentario}`
        : `DELETE FROM comentario WHERE idComentario = ${idComentario} AND fkUsuario = ${idUsuario}`;

    database.executar(sql)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log("Erro ao deletar:", err);
            res.status(500).send(err);
        });
});

// Rota pra apagar post 
router.delete("/:id", function (req, res) {
    const idPost = req.params.id;
    const idUsuario = req.query.idUsuario;

    const sql1 = `DELETE FROM comentario WHERE fkPost = ${idPost}`;
    const sql2 = `DELETE FROM curtida WHERE fkPost = ${idPost}`;
    const sql3 = `DELETE FROM post WHERE idPost = ${idPost} AND fkAdmin = ${idUsuario}`;

    database.executar(sql1)
        .then(() => database.executar(sql2))
        .then(() => database.executar(sql3))
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log("ERRO:", err);
            res.status(500).send(err);
        });
});

module.exports = router;