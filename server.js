// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require("dotenv").config();
const db = require("./database.js");
const express = require("express");
const passport = require("passport");
const csrf = require('csurf');
(async () => {
  await db.then(() => console.log("Connected to the database"));
  const app = express();
  const session = require("express-session");
  const MongoStore = require("connect-mongo")(session);
  require("./strategies/discord.js");
  app.use(express.static(__dirname + "/public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }))
  app.use(
    session({
      secret: process.env.SECRET,
      cookie: {
        maxAge: 60000 * 60 * 24
      },
      saveUninitialized: false,
      resave: false,
      name: "discord.oauth2",
      store: new MongoStore({ mongooseConnection: require("mongoose").connection })
    })
  );
  app.set("view engine", "ejs");
  app.set("views", require("path").join(__dirname, "views"));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(csrf());
  app.use("/auth", require("./routes/auth"));
  app.use("/dashboard", require("./routes/dashboard"));
  app.use("/wwd", require("./routes/wwd"));
  app.get("/", (req, res) => {
    if(req.user) {
      res.render("home", {
      username: req.user.username,
csrfToken: req.csrfToken(),
      avatar: req.user.avatar,
      logged: true
    });
    } else {
      res.render("home", {
      username: "stranger",
csrfToken: req.csrfToken(),
      logged: false
    });
    }
  });
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
  // listen for requests :)
  const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
})().catch(err => {
  console.log(err);
  process.exit(1);
});
