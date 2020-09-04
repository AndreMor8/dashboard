const router = require('express').Router();
const passport = require('passport');

router.get('/', isAuthorized, (req, res, next) => {
    passport.authenticate('discord', {
        state: req.csrfToken()
    })(req, res, next);
});
router.get('/redirect', (req, res, next) => {
    passport.authenticate('discord', {
        state: req.csrfToken(),
        failureRedirect: '/forbidden',
    })(req, res, next);
}, async (req, res) => {
    await new Promise((s, r) => setTimeout(s, 1500));
    res.redirect("/dashboard");
});
router.get('/logout', (req, res) => {
    if(req.user) {
        req.logout();
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});
router.get("/forbidden", (req, res) => {
  if(req.user && req.user.guilds && req.user.guilds[0] && req.user.discordId && req.user.username) {
      res.status(200).send("You shouldn't be here.");
  } else {
    res.status(403).send("It seems that the authentication could not be completed");
  }
})

function isAuthorized(req, res, next) {
    if(req.user) {
        res.redirect('/dashboard')
    }
    else {
        next();
    }
}

module.exports = router;