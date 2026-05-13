let postModel = require("../models/postModel");

function listar(req, res) {
    let idUsuario = req.query.idUsuario;

    postModel.listar(idUsuario)
        .then(function (r) { res.json(r); })
        .catch(function (e) { res.status(500).send(e); });
}

function listarMeus(req, res) {
    let idAdmin = req.query.idUsuario;

    if (!idAdmin) return res.status(400).send("ID não fornecido");

    postModel.listarMeus(idAdmin)
        .then(function (r) { res.json(r || []); })
        .catch(function (e) { res.status(500).send(e); });
}

function publicar(req, res) {
    let titulo = req.body.titulo;
    let conteudo = req.body.conteudo;
    let fkAdmin = req.body.fkAdmin;

    if (!req.file) {
        return res.status(400).send("Imagem não enviada");
    }

    let imagem = req.file.filename;

    postModel.publicar(titulo, conteudo, imagem, fkAdmin)
        .then(function () { res.sendStatus(200); })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err);
        });
}

function listarComentarios(req, res) {
    let idPost = req.params.id;

    postModel.listarComentarios(idPost)
        .then(function (r) { res.json(r); })
        .catch(function (e) { res.status(500).send(e); });
}

function comentar(req, res) {
    let idPost = req.params.id;
    let texto = req.body.texto;
    let idUsuario = req.body.idUsuario;

    if (!idUsuario) return res.status(401).send("Usuário não identificado");

    postModel.comentar(idUsuario, idPost, texto)
        .then(function () { res.sendStatus(200); })
        .catch(function (e) { res.status(500).send(e); });
}

function curtir(req, res) {
    let idPost = req.params.id;
    let curtir = req.body.curtir;
    let idUsuario = req.body.idUsuario;

    if (!idUsuario) return res.status(401).send("Usuário não identificado");

    postModel.curtir(idUsuario, idPost, curtir)
        .then(function () { res.sendStatus(200); })
        .catch(function (e) { res.status(500).send(e); });
}

function deletarComentario(req, res) {
    let idComentario = req.params.id;
    let idUsuario = req.body.idUsuario;
    let tipoUsuario = req.body.tipoUsuario;

    if (!idUsuario) return res.status(401).send("Usuário não identificado");

    postModel.deletarComentario(idComentario, idUsuario, tipoUsuario)
        .then(function () { res.sendStatus(200); })
        .catch(function (e) { res.status(500).send(e); });
}

function deletarPost(req, res) {
    let idPost = req.params.id;
    let idUsuario = req.query.idUsuario;

    postModel.deletarPost(idPost, idUsuario)
        .then(function () { res.sendStatus(200); })
        .catch(function (e) { res.status(500).send(e); });
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