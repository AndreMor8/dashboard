const router = require('express').Router();

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
})

module.exports = router;