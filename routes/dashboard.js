const router = require("express").Router();
const cp = require("../models/customresponses.js");
const prefix = require("../models/prefix.js");
const levels = require("../models/levelconfig.js");
const util = require("../utils/utils");
const fetch = require("node-fetch");
const safe = require("safe-regex");
router.use(function (req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/");
  }
})

router.use(async function (req, res, next) {
  try {
    const guilds = await util.getUserGuilds(req.user.discordId);
    req.user.guilds = guilds;
    const toshow = await util.getGuilds(guilds);
    req.user.toShowGuilds = toshow;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).redirect("/");
  }
})


router.get("/", async (req, res) => {
  res.status(200).render("dashboard0", {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    discordId: req.user.discordId,
    guilds: req.user.guilds,
    toshow: req.user.toShowGuilds,
    logged: true
  });
});

router.get("/guilds", async (req, res) => {
  const guildMemberPermissions = new Map();
  req.user.guilds.forEach(guild => {
    const perm = util.getPermissions(guild.permissions);
    guildMemberPermissions.set(guild.id, perm);
  });
  res.render("guilds", {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    discordId: req.user.discordId,
    guilds: req.user.guilds,
    permissions: guildMemberPermissions,
    logged: true
  });
});

router.use("/:guildID", function (req, res, next) {
  const guild = req.user.toShowGuilds.find(e => e.id === req.params.guildID);
  if (!guild) return res.status(403).send("That ID is not in your server list...");
  else {
    fetch(process.env.FETCH + "?delete=" + req.params.guildID, {
      method: "GET",
      headers: {
        pass: process.env.ACCESS
      }
    }).then(c => console.log(c.status)).catch(err => {});
    next();
  }
});

router.get("/:guildID", async (req, res) => {
  res.status(200).render("dashboard1", {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    discordId: req.user.discordId,
    guilds: req.user.guilds,
    toshow: req.user.toShowGuilds,
    focus: req.params.guildID,
    logged: true,
    option: false
  });
});

router.get("/:guildID/levels", async (req, res) => {
  let msgDocument = await levels.findOne({ guildId: { $eq: req.params.guildID } });
  if (!msgDocument) {
    msgDocument = await levels.create({
      guildId: req.params.guildID,
      levelnotif: false,
      levelsystem: false,
      roles: []
    });
  }
  /* Render the data to front-end */
  res.status(200).render("dashboard1", {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    discordId: req.user.discordId,
    guilds: req.user.guilds,
    toshow: req.user.toShowGuilds,
    focus: req.params.guildID,
    logged: true,
    option: "levels",
    data: msgDocument
  });
})

router.post("/:guildID/levels", async (req, res) => {
  let msgDocument = await levels.findOne({ guildId: { $eq: req.params.guildID } });
  if (msgDocument) {
    await msgDocument.updateOne({ levelsystem: (req.body.system === 'true' ? true : false), levelnotif: (req.body.notif === 'true' ? true : false) })
  } else {
    await levels.create({
      levelsystem: (req.body.system === 'true' ? true : false),
      levelnotif: (req.body.notif === 'true' ? true : false),
      guildId: req.params.guildID,
      roles: []
    });
  }
  await new Promise(s => setTimeout(s, 1000));
  res.status(200).redirect("./levels");
});

router.get("/:guildID/cp", async (req, res) => {
  let msgDocument = await cp.findOne({ guildId: { $eq: req.params.guildID } });
  if (!msgDocument) {
    msgDocument = {
      guildId: req.params.guildID,
      responses: {}
    }
  }
  res.status(200).render("dashboard1", {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    discordId: req.user.discordId,
    guilds: req.user.guilds,
    toshow: req.user.toShowGuilds,
    focus: req.params.guildID,
    logged: true,
    option: "cp",
    data: msgDocument
  });
});

router.post("/:guildID/cp", async (req, res) => {
  if (!req.body) return res.status(400).send("You haven't sent anything. Submit something and try again.");
  if (!req.body.match) return res.status(400).send("Missing match parameter");
  if (!req.body.response) return res.status(400).send("Missing response parameter");
  if (!safe(req.body.match)) return res.status(400).send("Invalid or insecure match parameter");
  let msgDocument = await cp.findOne({ guildId: { $eq: req.params.guildID } });
  if (msgDocument) {
    let { responses } = msgDocument;
    const files = [];
    if (req.body.link) {
      files.push(req.body.link);
    }
    responses[req.body.match] = { content: req.body.response, files: files };
    await msgDocument.updateOne({ responses: responses });
  } else {
    const responses = {};
    const files = [];
    if (req.body.link) {
      files.push(req.body.link);
    }
    responses[req.body.match] = { content: req.body.response, files: files };
    await cp.create({
      guildId: req.params.guildID,
      responses: responses
    });
  }
  await new Promise(s => setTimeout(s, 1000));
  res.status(200).redirect("./cp");
});

router.delete("/:guildID/cp/:id", async (req, res) => {
  let value = req.params.id;
  let msgDocument = await cp.findOne({ guildId: { $eq: req.params.guildID } });
  if (msgDocument) {
    let { responses } = msgDocument
    const id = parseInt(value);
    const keys = Object.keys(responses);
    if (id < keys.length && id >= 0) {
      let word = keys[id];
      if (responses.hasOwnProperty(word)) {
        delete responses[word];
        const a = Object.keys(responses);
        if (a.length < 1) {
          await msgDocument.deleteOne()
        } else {
          await msgDocument.updateOne({ responses: responses })
        }
      }
    }
  } else {
    return res.sendStatus(404);
  }
  res.sendStatus(204);
})

router.get("/:guildID/prefix", async (req, res) => {
  let msgDocument = await prefix.findOne({ guildId: req.params.guildID });
  if (!msgDocument) msgDocument = await prefix.create({
    guildId: req.params.guildID,
    prefix: "g%"
  });
  res.status(200).render("dashboard1", {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    discordId: req.user.discordId,
    guilds: req.user.guilds,
    toshow: req.user.toShowGuilds,
    focus: req.params.guildID,
    logged: true,
    option: "prefix",
    data: msgDocument
  });
});

router.post("/:guildID/prefix", async (req, res) => {
  if (!req.body) return res.status(400).send("You haven't sent anything. Submit something and try again.");
  if (!req.body.prefix) return res.status(400).send("Missing parameter prefix");
  let msgDocument = await prefix.findOne({ guildId: req.params.guildID })
  if (msgDocument) {
    await msgDocument.updateOne({ prefix: req.body.prefix });
  } else {
    await prefix.create({
      guildId: req.params.guildID,
      prefix: req.body.prefix
    });
  }
  await new Promise(s => setTimeout(s, 1000));
  res.status(200).redirect("./prefix");
});

module.exports = router;
