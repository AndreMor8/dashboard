const keys = new Set();
const router = require('express').Router();
const passport = require('passport');

router.get('/', isAuthorized, (req, res, next) => {
    const key = req.csrfToken();
    if(req.query.error) {
        keys.delete(req.query.state);
        return res.redirect(302, "/");
    } else if(req.query.code) {
        if(typeof req.query.state !== "string") return res.status(400).send("No state query found. Try re-login!");
        if(!keys.has(req.query.state)) return res.status(400).send("Invalid state key! Try re-login!");
        keys.delete(req.query.state);
    } else {
        keys.add(key);
    }
    passport.authenticate('discord', {
        state: key,
        failureMessage: true,
        scope: ["identify", "guilds"],
        successRedirect: "https://gidget.andremor.dev",
        callbackURL: process.env.CLIENT_REDIRECT
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    if (req.user) {
        req.logout();
    }
    res.redirect('/');
});

function isAuthorized(req, res, next) {
    if (req.user) {
        res.redirect('/')
    }
    else {
        next();
    }
}

module.exports = router;