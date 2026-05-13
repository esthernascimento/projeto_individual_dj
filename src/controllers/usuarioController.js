let usuarioModel = require("../models/usuarioModel");

function cadastrar(req, res) {
    let nome = req.body.nomeServer;
    let email = req.body.emailServer;
    let senha = req.body.senhaServer;
    let dtNasc = req.body.dtNascServer;
    let estilo = req.body.estiloServer;

    let imagem = req.file ? req.file.filename : "default.png";

    if (!nome || !email || !senha || !dtNasc || !estilo) {
        res.status(400).send("Preencha todos os campos!");
    } else {
        usuarioModel.cadastrar(nome, dtNasc, email, senha, imagem, estilo)
            .then(resultado => res.json(resultado))
            .catch(erro => {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function autenticar(req, res) {
    let email = req.body.emailServer;
    let senha = req.body.senhaServer;

    if (email == undefined || senha == undefined) {
        res.status(400).send("Dados de login incompletos!");
    } else {
        usuarioModel.autenticar(email, senha)
            .then(function (resultado) {
                if (resultado.length == 1) {
                    res.json({
                        idUsuario: resultado[0].idUsuario,
                        email: resultado[0].email,
                        nome: resultado[0].nome,
                        tipoUser: resultado[0].tipoUser,
                        imagemUsuario: resultado[0].imagemUsuario,
                        estiloMusical: resultado[0].estiloMusical 
                    });
                } else {
                    res.status(403).send("Email e/ou senha inválido(s)");
                }
            }).catch(function (erro) {
                res.status(500).json(erro.sqlMessage);
            });
    }
} 

function buscarUsuarioPeloId(req, res) {
    usuarioModel.buscarUsuarioPeloId(req.params.idUsuario)
        .then(resultado => res.json(resultado))
        .catch(err => res.status(500).send(err));
}

function buscarUsuarioPeloEmail(req, res) {
    let email = decodeURIComponent(req.params.email); // decodifica o @
    usuarioModel.buscarUsuarioPeloEmail(email)
        .then(resultado => res.json(resultado))
        .catch(err => res.status(500).send(err));
}

function atualizar(req, res) {
    let id = req.params.idUsuario;
    let nome = req.body.nome;
    let email = req.body.email;
    let senha = req.body.senha;

    let imagem = req.file ? req.file.filename : null;

    console.log("IMAGEM RECEBIDA:", imagem); // debug

    usuarioModel.atualizar(id, nome, email, senha, imagem)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
}

module.exports = {
    autenticar,
    cadastrar,
    buscarUsuarioPeloId,
    buscarUsuarioPeloEmail,
    atualizar
};
