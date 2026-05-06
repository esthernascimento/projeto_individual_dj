const dashboardModel = require("../models/dashboardModel");

function numeros(req, res) {
    dashboardModel.numeros()
        .then(r => res.json(r[0]))
        .catch(e => res.status(500).send(e));
}

function generos(req, res) {
    dashboardModel.generos()
        .then(r => res.json(r))
        .catch(e => res.status(500).send(e));
}

function crescimento(req, res) {
    dashboardModel.crescimento()
        .then(r => res.json(r))
        .catch(e => res.status(500).send(e));
}

function postsRecentes(req, res) {
    dashboardModel.postsRecentes()
        .then(r => res.json(r || []))
        .catch(e => res.status(500).send(e));
}

function interacoes(req, res) {
    dashboardModel.interacoes()
        .then(r => res.json(r[0]))
        .catch(e => res.status(500).send(e));
}

function postMaisEngajado(req, res) {
    dashboardModel.postMaisEngajado()
        .then(r => {
            if (r.length > 0) res.json(r[0]);
            else res.status(204).send();
        })
        .catch(e => res.status(500).send(e));
}

module.exports = {
    numeros,
    generos,
    crescimento,
    postsRecentes,
    interacoes,
    postMaisEngajado
};