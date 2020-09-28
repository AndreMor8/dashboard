const keys = new Set();
const router = require('express').Router();
const passport = require('passport');

router.get('/', isAuthorized, (req, res, next) => {
    const key = req.csrfToken();
    if(req.query.code) {
        if(typeof req.query.state !== "string") return res.status(400).send("No state query found. Try re-login!");
        if(!keys.has(req.query.state)) return res.status(400).send("Invalid state key! Try re-login!");
        keys.delete(req.query.state);
    } else {
        keys.add(key);
    }
    passport.authenticate('discord', {
        state: key,
        failureMessage: true,
        scope: ["identify", "guilds"]
    })(req, res, next);
}, async (req, res, next) => {
    res.status(200).render("logged", {
        logged: true,
        username: req.user.username
    });
});

router.get('/logout', (req, res) => {
    if (req.user) {
        req.logout();
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

function isAuthorized(req, res, next) {
    if (req.user) {
        res.redirect('/dashboard')
    }
    else {
        next();
    }
}

module.exports = router;