const postModel = require("../models/postModel");

function listar(req, res) {
    const idUsuario = req.query.idUsuario;

    postModel.listar(idUsuario)
        .then(r => res.json(r))
        .catch(e => res.status(500).send(e));
}

function listarMeus(req, res) {
    const idAdmin = req.query.idUsuario;

    if (!idAdmin) return res.status(400).send("ID não fornecido");

    postModel.listarMeus(idAdmin)
        .then(r => res.json(r || []))
        .catch(e => res.status(500).send(e));
}

function publicar(req, res) {
    const { titulo, conteudo, fkAdmin } = req.body;

    if (!req.file) {
        return res.status(400).send("Imagem não enviada");
    }

    const imagem = req.file.filename;

    postModel.publicar(titulo, conteudo, imagem, fkAdmin)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log("ERRO:", err);
            res.status(500).send(err);
        });
}

function listarComentarios(req, res) {
    const idPost = req.params.id;

    postModel.listarComentarios(idPost)
        .then(r => res.json(r))
        .catch(e => res.status(500).send(e));
}

function comentar(req, res) {
    const idPost = req.params.id;
    const { texto, idUsuario } = req.body;

    if (!idUsuario) return res.status(401).send("Usuário não identificado");

    postModel.comentar(idUsuario, idPost, texto)
        .then(() => res.sendStatus(200))
        .catch(e => res.status(500).send(e));
}

function curtir(req, res) {
    const idPost = req.params.id;
    const { curtir, idUsuario } = req.body;

    if (!idUsuario) return res.status(401).send("Usuário não identificado");

    postModel.curtir(idUsuario, idPost, curtir)
        .then(() => res.sendStatus(200))
        .catch(e => res.status(500).send(e));
}

function deletarComentario(req, res) {
    const idComentario = req.params.id;
    const { idUsuario, tipoUsuario } = req.body;

    if (!idUsuario) return res.status(401).send("Usuário não identificado");

    postModel.deletarComentario(idComentario, idUsuario, tipoUsuario)
        .then(() => res.sendStatus(200))
        .catch(e => res.status(500).send(e));
}

function deletarPost(req, res) {
    const idPost = req.params.id;
    const idUsuario = req.query.idUsuario;

    postModel.deletarPost(idPost, idUsuario)
        .then(() => res.sendStatus(200))
        .catch(e => res.status(500).send(e));
}

module.exports = {
    listar,
    listarMeus,
    publicar,
    listarComentarios,
    comentar,
    curtir,
    deletarComentario,
    deletarPost
};