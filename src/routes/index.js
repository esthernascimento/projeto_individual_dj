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

/* rotas do usuário */
router.get("usuario/feed", function (req, res) {
    res.render("feed");
});

router.get("usuario/perfil-usuario", function(re, res) {
    res.render("perfil-usuario")
});

router.get("usuario/curiosidades", function(req, res){
    res.render("curiosidades")
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

router.get("/visualizar-posts", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../../public/dashboard/visualizar-posts.html"));
});

module.exports = router;