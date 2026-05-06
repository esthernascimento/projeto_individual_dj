var dashboardModel = require("../models/dashboardModel");

function numeros(req, res) {
    dashboardModel.numeros()
        .then(function (r) {
            res.json(r[0]);
        })
        .catch(function (e) {
            res.status(500).send(e);
        });
}

function generos(req, res) {
    dashboardModel.generos()
        .then(function (r) {
            res.json(r);
        })
        .catch(function (e) {
            res.status(500).send(e);
        });
}

function crescimento(req, res) {
    dashboardModel.crescimento()
        .then(function (r) {
            res.json(r);
        })
        .catch(function (e) {
            res.status(500).send(e);
        });
}

function postsRecentes(req, res) {
    dashboardModel.postsRecentes()
        .then(function (r) {
            res.json(r || []);
        })
        .catch(function (e) {
            res.status(500).send(e);
        });
}

function interacoes(req, res) {
    dashboardModel.interacoes()
        .then(function (r) {
            res.json(r[0]);
        })
        .catch(function (e) {
            res.status(500).send(e);
        });
}

function postMaisEngajado(req, res) {
    dashboardModel.postMaisEngajado()
        .then(function (r) {
            if (r.length > 0) {
                res.json(r[0]);
            } else {
                res.status(204).send();
            }
        })
        .catch(function (e) {
            res.status(500).send(e);
        });
}

module.exports = {
    numeros,
    generos,
    crescimento,
    postsRecentes,
    interacoes,
    postMaisEngajado
};