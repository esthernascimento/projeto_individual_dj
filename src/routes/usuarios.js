var express = require("express");
var router = express.Router();
var usuarioController = require("../controllers/usuarioController");

const upload = require("../config/upload");

router.post("/cadastrar", upload.single('fotoPerfil'), function (req, res) {
    usuarioController.cadastrar(req, res);
});

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.get("/email/:email", usuarioController.buscarUsuarioPeloEmail);
router.get("/:idUsuario",   usuarioController.buscarUsuarioPeloId);
// router.put("/:idUsuario", usuarioController.atualizar); 
router.put("/:idUsuario", upload.single('fotoPerfil'), usuarioController.atualizar);

module.exports = router;