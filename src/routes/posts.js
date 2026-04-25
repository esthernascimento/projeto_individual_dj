var express = require("express");
var router = express.Router();
var database = require("../database/config");
const upload = require("../config/upload");

// listar POSTS
router.get("/listar", function (req, res) {
    const sql = `
        SELECT p.*, u.nome 
        FROM post p
        JOIN usuario u ON p.fkAdmin = u.idUsuario
        ORDER BY dtPostagem DESC
    `;

    database.executar(sql)
        .then(resultado => res.json(resultado))
        .catch(err => {
            console.log("ERRO:", err);
            res.status(500).send(err);
        });
});

// publicar POST
router.post("/publicar", upload.single("imagem"), function (req, res) {
    const { titulo, conteudo, fkAdmin } = req.body;

    if (!req.file) {
        return res.status(400).send("Imagem não enviada");
    }

    const imagem = req.file.filename;

    const sql = `
        INSERT INTO post (titulo, conteudo, imagemPost, fkAdmin)
        VALUES ('${titulo}', '${conteudo}', '${imagem}', ${fkAdmin});
    `;

    database.executar(sql)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            console.log("ERRO:", err);
            res.status(500).send(err);
        });
});

module.exports = router;