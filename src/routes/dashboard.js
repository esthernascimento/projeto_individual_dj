const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/numeros", dashboardController.numeros);
router.get("/generos", dashboardController.generos);
router.get("/crescimento", dashboardController.crescimento);
router.get("/posts-recentes", dashboardController.postsRecentes);
router.get("/interacoes", dashboardController.interacoes);
router.get("/post-mais-engajado", dashboardController.postMaisEngajado);

module.exports = router;