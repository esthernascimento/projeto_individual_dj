var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.render("index");
});

router.get("/cultura", function (req, res) {
    res.render("cultura");
});

router.get("/sobre", function (req, res) {
    res.render("sobre");
});

module.exports = router;