var express = require("express");
var router = express.Router();
var database = require("../database/config");
const upload = require("../config/upload");

// Listar TODOS os posts (feed do usuário comum)
router.get("/listar", function (req, res) {
    const sql = `
        SELECT p.*, u.nome 
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
    // Pegamos o ID que vem na URL: ?idUsuario=2
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
            // Importante: Garantir que sempre retorne um array, mesmo vazio
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
// Retorna só comentários aprovados (statusComentario = 1)
router.get("/:id/comentarios", function (req, res) {
    const idPost = req.params.id;

    const sql = `
        SELECT co.comentarioDescricao AS texto, u.nome AS autor, co.dtComentario
        FROM comentario co
        JOIN usuario u ON co.fkUsuario = u.idUsuario
        WHERE co.fkPost = ${idPost}
          AND co.statusComentario = 1
        ORDER BY co.dtComentario ASC
    `;

    database.executar(sql)
        .then(resultado => res.json(resultado))
        .catch(err => {
            console.log("ERRO:", err);
            res.status(500).send(err);
        });
});

// Enviar comentário 
router.post("/:id/comentarios", function (req, res) {
    const idPost = req.params.id;
    const { texto } = req.body;
    const idUsuario = req.session?.usuario?.idUsuario;

    if (!idUsuario) {
        return res.status(401).json({ erro: "Sessão expirada." });
    }

    if (!texto || texto.trim() === "") {
        return res.status(400).json({ erro: "Comentário vazio." });
    }

    // statusComentario = 1 → aprovado direto
    // Troque para 0 se quiser moderação antes de exibir
    const sql = `
        INSERT INTO comentario (fkUsuario, fkPost, comentarioDescricao, statusComentario)
        VALUES (${idUsuario}, ${idPost}, '${texto.trim()}', 1)
    `;

    database.executar(sql)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log("ERRO:", err);
            res.status(500).send(err);
        });
});

// Curtir / descurtir post 
router.post("/:id/curtir", function (req, res) {
    const idPost = req.params.id;
    const idUsuario = req.session?.usuario?.idUsuario;
    const { curtir } = req.body; // true = curtir, false = descurtir

    if (!idUsuario) {
        return res.status(401).json({ erro: "Sessão expirada." });
    }

    // INSERT IGNORE respeita a chave composta, pro usuario não duplicar curtidaaa
    const sql = curtir
        ? `INSERT IGNORE INTO curtida (fkUsuario, fkPost) VALUES (${idUsuario}, ${idPost})`
        : `DELETE FROM curtida WHERE fkUsuario = ${idUsuario} AND fkPost = ${idPost}`;

    database.executar(sql)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log("ERRO:", err);
            res.status(500).send(err);
        });
});

module.exports = router;