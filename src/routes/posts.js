const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const upload = require("../config/upload");

router.get("/listar", postController.listar);
router.get("/meus", postController.listarMeus);
router.get("/:id/comentarios", postController.listarComentarios);

router.post("/:id/comentarios", postController.comentar);
router.post("/:id/curtir", postController.curtir);

router.delete("/comentarios/:id", postController.deletarComentario);
router.delete("/:id", postController.deletarPost);

router.post("/publicar", upload.single("imagem"), postController.publicar);

module.exports = router;

