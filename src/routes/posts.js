var express = require("express");
var router = express.Router();
var postController = require("../controllers/postController");
var upload = require("../config/upload");

// posts
router.get("/listar", postController.listar);
router.get("/meus", postController.listarMeus);
router.post("/publicar", upload.single("imagem"), postController.publicar);

// comentários
router.get("/:id/comentarios", postController.listarComentarios);
router.post("/:id/comentarios", postController.comentar);
router.delete("/comentarios/:id", postController.deletarComentario);

// curtida
router.post("/:id/curtir", postController.curtir);

// deletar post
router.delete("/:id", postController.deletarPost);

module.exports = router;