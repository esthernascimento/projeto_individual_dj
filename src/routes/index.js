var express = require("express");
var router = express.Router();
var path = require("path");

router.get("/", function (req, res) {
    res.render("index");
});

router.get("/cultura", function (req, res) {
    res.render("cultura");
});

router.get("/sobre", function (req, res) {
    res.render("sobre");
});

router.get("/feed", function (req, res) {
    res.render("feed");
});

/* rotas da dash */
router.get("/dashboard-adm", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../../public/dashboard/dashboard-adm.html"));
});

router.get("/perfil-adm", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../../public/dashboard/perfil-adm.html"));
});

router.get("/criar-post", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../../public/dashboard/criar-post.html"));
});

module.exports = router;