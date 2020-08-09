const router = require("express").Router();
const util = require("../utils/utils");
const fetch = require("node-fetch");
const dash = require("./dashboard/main.js");

function isAuthorized(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/");
  }
}

router.get("/", isAuthorized, async (req, res) => {
  try {
  const guilds = await util.getUserGuilds(req.user.discordId)
  await new Promise((s, r) => setTimeout(s, 1000));
  const toshow = await util.getGuilds(guilds);
  res.status(200).render("dashboard0", {
    username: req.user.username,
    discordId: req.user.discordId,
    guilds: guilds,
    toshow: toshow,
    logged: true
  });
 } catch (err) {
    console.log(err);
    res.status(500).redirect("/");
 }
});

router.get("/guilds", isAuthorized, async (req, res) => {
  const guilds = await util.getUserGuilds(req.user.discordId);
  const guildMemberPermissions = new Map();
  guilds.forEach(guild => {
    const perm = util.getPermissions(guild.permissions);
    guildMemberPermissions.set(guild.id, perm);
  });
  res.render("guilds", {
    username: req.user.username,
    discordId: req.user.discordId,
    guilds: guilds,
    permissions: guildMemberPermissions,
    logged: true
  });
});

router.get("/settings", isAuthorized, (req, res) => {
  res.sendStatus(200);
});

router.get("/:guildID/", isAuthorized, async (req, res) => {
  if (req.params && req.params.guildID) {
    const guilds = await util.getUserGuilds(req.user.discordId)
    const toshow = await util.getGuilds(guilds);
    const guild = toshow.find(e => e.id === req.params.guildID);
    if (!guild)
      return res.status(403).send("That ID is not in your server list...");
    else
      res.status(200).render("dashboard1", {
        username: req.user.username,
        discordId: req.user.discordId,
        guilds: guilds,
        toshow: toshow,
        focus: req.params.guildID,
        logged: true,
        option: false
      });
  } else res.sendStatus(200);
});

router.get("/:guildID/:config", isAuthorized, dash.get);

router.post("/:guildID/:config", isAuthorized, dash.post);

module.exports = router;
