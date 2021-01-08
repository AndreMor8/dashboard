const router = require("express").Router();
const cp = require("../models/customresponses.js");
const prefix = require("../models/prefix.js");
const levels = require("../models/levelconfig.js");
const welcome = require("../models/welcome.js");
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
    const bot_thing = await util.getBotGuilds(guilds);
    const toshow = util.getGuilds(bot_thing, guilds);
    req.user.toShowGuilds = toshow;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).redirect("/");
  }
})


router.get("/", async (req, res) => {
  const adminguilds = req.user.guilds.filter(e => util.getPermissions(e.permissions).get("ADMINISTRATOR"));
  res.status(200).render("dashboard0", {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    discordId: req.user.discordId,
    guilds: req.user.guilds,
    adminguilds,
    toshow: req.user.toShowGuilds,
    logged: true,
    
    
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
    logged: true,
    
    
  });
});

router.use("/:guildID", function (req, res, next) {
  const guild = req.user.toShowGuilds.find(e => e.id === req.params.guildID);
  if (!guild) return res.status(403).send("That ID is not in your server list...");
  else {
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      fetch(process.env.FETCH + "?delete=" + req.params.guildID, {
        method: "GET",
        headers: {
          pass: process.env.ACCESS
        }
      }).then(c => console.log(c.status)).catch(err => { });
    }
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
    option: false,
    
    
  });
});
/*
router.get("/:guildID/members", async (req, res) => {
  const members = await util.getGuildMembers(req.params.guildID, 100);
  console.log(members);
  res.status(200).render("dashboard1", {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    discordId: req.user.discordId,
    guilds: req.user.guilds,
    toshow: req.user.toShowGuilds,
    focus: req.params.guildID,
    logged: true,
    option: "members",
    data: members,
    avatar: function avatar([a, id], d) {
      if (a) {
        if (a.startsWith("a_")) return `https://cdn.discordapp.com/avatars/${id}/${a}.gif?size=128`;
        else return `https://cdn.discordapp.com/avatars/${id}/${a}.png?size=128`;
      } else {
        return `https://cdn.discordapp.com/embed/avatars/${d % 5}.png`;
      }
    }
  });
}); */

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
    data: msgDocument,
    
    
  });
})

router.put("/:guildID/levels", async (req, res) => {
  try {
    if (typeof req.body.system !== "boolean") return res.status(400).send("Missing or invalid system parameter");
    if (typeof req.body.notif !== "boolean") return res.status(400).send("Missing or invalid notif parameter");
    let msgDocument = await levels.findOne({ guildId: { $eq: req.params.guildID } });
    if (msgDocument) {
      await msgDocument.updateOne({ levelsystem: req.body.system, levelnotif: req.body.notif })
    } else {
      await levels.create({
        levelsystem: req.body.system,
        levelnotif: req.body.notif,
        guildId: req.params.guildID,
        roles: []
      });
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.toString());
  }
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
    data: msgDocument,
    
    
  });
});

router.post("/:guildID/cp", async (req, res) => {
  if (!req.body) return res.status(400).send("You haven't sent anything. Submit something and try again.");
  if (!req.body.match) return res.status(400).send("Missing match parameter");
  if (!req.body.response) return res.status(400).send("Missing response parameter");
  if (!safe(req.body.match)) return res.status(400).send("Invalid or insecure match parameter");
  if (req.body.link) {
    if (!util.urlRegex.test(req.body.link)) {
      return res.status(400).send("Invalid file URL!");
    }
  }
  let msgDocument = await cp.findOne({ guildId: { $eq: req.params.guildID } });
  if (msgDocument) {
    let { responses } = msgDocument;
    const check = Object.keys(responses).find(e => e === req.body.match);
    if(check) return res.status(400).send("There is already a match of the same text. Put another.")
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
  res.status(200).redirect("./cp");
});

router.delete("/:guildID/cp", async (req, res) => {
  if (!req.body) return res.status(400).send("Nothing send");
  if (isNaN(req.body.id)) return res.status(400).send("Missing or invalid ID parameter")
  let value = req.body.id;
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
    data: msgDocument,
    
    
  });
});

router.put("/:guildID/prefix", async (req, res) => {
  try {
    if (!req.body) return res.status(400).send("You haven't sent anything. Submit something and try again.");
    if (!req.body.prefix) return res.status(400).send("Missing parameter prefix");
    let msgDocument = await prefix.findOne({ guildId: { $eq: req.params.guildID } })
    if (msgDocument) {
      await msgDocument.updateOne({ prefix: req.body.prefix });
    } else {
      await prefix.create({
        guildId: req.params.guildID,
        prefix: req.body.prefix
      });
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

router.get("/:guildID/welcome", async (req, res) => {
  const msgDocument = await welcome.findOne({ guildID: { $eq: req.params.guildID } });
  if (!msgDocument) {
    msgDocument = {
      guildID: req.params.guildID,
      enabled: false,
      text: "Welcome to the server, %MEMBER%",
      channelID: null,
      dmenabled: false,
      dmtext: "Welcome to the server, %MEMBER%",
      leaveenabled: false,
      leavechannelID: null,
      leavetext: "We're sorry to see you leaving, %MEMBER%"
    }
  }
  const channels = await util.getGuildChannels(req.params.guildID);
  if (!Array.isArray(channels)) {
    console.error(channels);
    return res.status(500).send("Something happened! " + channels.message);
  }
  const textChannels = channels.filter(e => [0, 5].includes(e.type));
  res.status(200).render("dashboard1", {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    discordId: req.user.discordId,
    guilds: req.user.guilds,
    toshow: req.user.toShowGuilds,
    focus: req.params.guildID,
    logged: true,
    option: "welcome",
    data: msgDocument,
    textChannels,
    
    
  });
});

router.put("/:guildID/welcome", async (req, res) => {
  if (typeof req.body.enabled !== "boolean") return res.sendStatus(400);
  if (!req.body.text) return res.sendStatus(400);
  if (!req.body.channelID) return res.sendStatus(400);
  if (typeof req.body.dmenabled !== "boolean") return res.sendStatus(400);
  if (!req.body.dmtext) return res.sendStatus(400);
  if (typeof req.body.leaveenabled !== "boolean") return res.sendStatus(400);
  if (!req.body.leavetext) return res.sendStatus(400);
  if (!req.body.leavechannelID) return res.sendStatus(400);
  try {
    const channels = await util.getGuildChannels(req.params.guildID);
    if (!Array.isArray(channels)) {
      console.error(channels);
      return res.status(500).send("Something happened! " + channels.message);
    }
    const textChannels = channels.filter(e => [0, 5].includes(e.type));
    if (!textChannels.find(e => e.id === req.body.channelID)) return res.status(400).send("Invalid channel in 'channelID' parameter");
    if (!textChannels.find(e => e.id === req.body.leavechannelID)) return res.status(400).send("Invalid channel in 'leavechannelID' parameter");
    const msgDocument = await welcome.findOne({ guildID: { $eq: req.params.guildID } });
    if (msgDocument) {
      await msgDocument.updateOne({
        enabled: req.body.enabled,
        text: req.body.text,
        channelID: req.body.channelID,
        dmenabled: req.body.dmenabled,
        dmtext: req.body.dmtext,
        leaveenabled: req.body.leaveenabled,
        leavetext: req.body.leavetext,
        leavechannelID: req.body.leavechannelID
      });
    } else {
      await welcome.create({
        enabled: req.body.enabled,
        text: req.body.text,
        channelID: req.body.channelID,
        dmenabled: req.body.dmenabled,
        dmtext: req.body.dmtext,
        leaveenabled: req.body.leaveenabled,
        leavetext: req.body.leavetext,
        leavechannelID: req.body.leavechannelID
      });
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("Something happened! " + err.toString());
  }
});

module.exports = router;
