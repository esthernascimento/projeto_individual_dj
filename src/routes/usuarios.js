var express = require("express");
var router = express.Router();
var multer = require("multer");
var usuarioController = require("../controllers/usuarioController");

// Onde e como salvar o arquivo da foto
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});

var upload = multer({ storage: storage });

router.post("/cadastrar", upload.single('fotoPerfil'), function (req, res) {
    usuarioController.cadastrar(req, res);
});

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

module.exports = router;