const router = require('express').Router();
const utils = require("../utils/utils");

router.get("/", (req, res) => {
    res.render("home", {
        username: req.user ? req.user.username : "stranger",
        csrfToken: req.csrfToken(),
        avatar: req.user ? req.user.avatar : null,
        logged: req.user ? true : false,
        antixss,
        antixsslinks
    });
});

router.get("/thanks", (req, res) => {
    res.render("thanks", {
        username: req.user ? req.user.username : "stranger",
        csrfToken: req.csrfToken(),
        avatar: req.user ? req.user.avatar : null,
        logged: req.user ? true : false,
        antixss,
        antixsslinks
    })
});

router.get("/andremor", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const response = await utils.getUser("577000793094488085");
    if(!response.message) return res.status(200).send(`${response.username}#${response.discriminator}`);
    else return res.status(500).send("AndreMor");
});

module.exports = router;