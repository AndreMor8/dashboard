require("dotenv").config({ path: __dirname + "/.env" });
const db = require("./database.js");
const express = require("express");
const passport = require("passport");
const csrf = require('csurf');
const path = require('path');
(async () => {
    await db();
    const app = express();
    const session = require("express-session");
    const MongoStore = require("connect-mongo")(session);
    require("./strategies/discord.js");
    app.use(express.json());
    app.use(
        session({
            secret: process.env.SECRET || "?",
            cookie: {
                maxAge: 60000 * 60 * 24
            },
            saveUninitialized: false,
            resave: false,
            name: "discord.oauth2",
            store: new MongoStore({ mongooseConnection: require("mongoose").connection })
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(csrf());
    if(process.env.SERVESTATIC === 'true') app.use(express.static(path.join(__dirname, "../public")));
    app.use("/api", require("./routes/main"));

    app.use(function (err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN') return next(err)

        // handle CSRF token errors here
        res.status(403)
        res.send('form tampered with')
    })
    app.use(function (err, req, res, next) {
        if (err) {
            console.log(err);
            return res.status(500).send("Something happened: " + err);
        } else next();
    });
    app.use("*", function (req, res) {
        if(process.env.SERVESTATIC === 'true') res.status(200).sendFile(path.join(__dirname, "../public/index.html"));
        else res.redirect('/');
    });
    const listener = app.listen(process.env.PORT, () => {
        console.log("Your app is listening on port " + listener.address().port);
    });
})().catch(err => {
    console.log(err);
    process.exit(1);
});
