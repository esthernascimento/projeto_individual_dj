var usuarioModel = require("../models/usuarioModel");

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var dtNasc = req.body.dtNascServer;

    var imagem;
    if (req.file != undefined) {
        imagem = req.file.filename;
    } else {
        imagem = "default.png"; 
    }

    if (nome == undefined) {
        res.status(400).send("Seu nome está indefinido!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está indefinido!");
    } else {
        usuarioModel.cadastrar(nome, dtNasc, email, senha, imagem)
            .then(function (resultado) {
                res.json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

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
                        imagemUsuario: resultado[0].imagemUsuario
                    });
                } else {
                    res.status(403).send("Email e/ou senha inválido(s)");
                }
            }).catch(function (erro) {
                res.status(500).json(erro.sqlMessage);
            });
    }

    function buscarUsuarioPeloId(req, res) {
      console.log(req.params.idUsuario);
      usuarioModel.buscarUsuarioPeloId(req.params.idUsuario)
      .then(resultado => {
        res.json(resultado);
      }).catch(err => {
        res.status(500).send(err);
      });
    }
}

module.exports = {
    autenticar,
    cadastrar
};