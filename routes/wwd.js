const router = require('express').Router();
const wwr = require("../models/wwr");
const { getPermissions } = require('../utils/utils');
const Discord = require("discord.js");
const DiscordUser = require("../models/DiscordUser");
const fetch = require("node-fetch");
const bans = require("../models/appeals");
const utils = require('../utils/utils');
const birthday = require("../models/birthday");

router.use(async function (req, res, next) {
  if (req.user) {
    const guilds = await utils.getUserGuilds(req.user.discordId);
    req.user.guilds = guilds;
  }
  next();
});

function isLogged(req, res, next) {
  if (req.user) next();
  else res.status(401).redirect("/");
};

function isInWDD(req, res, next) {
  const wwd = req.user.guilds.find(e => e.id === "402555684849451028");
  if (wwd) next();
  else res.status(403).send("You must be on the Wow Wow Discord server before viewing this category.");
}

function isWWDAdmin(req, res, next) {
  const guild = req.user.guilds.find(e => e.id === "402555684849451028")
  const permissions = utils.getPermissions(guild.permissions);
  if (!permissions.get("ADMINISTRATOR")) return res.status(403).send("You must be an administrator of Wow Wow Discord to view this page.")
  next();
}

function isWWDVerified(req, res, next) {
  const guild = req.user.guilds.find(e => e.id === "402555684849451028")
  const permissions = utils.getPermissions(guild.permissions);
  if (!permissions.get("ATTACH_FILES")) return res.status(403).send("You must be an administrator of Wow Wow Discord to view this page.")
  next();
}

///////////////////////////////////// NON-LOGGED USERS //////////////////////////////////////

router.get('/', async (req, res) => {
  res.render("wwd", {
    username: req.user ? req.user.username : "stranger",
    csrfToken: req.csrfToken(),
    avatar: req.user ? req.user.avatar : null,
    inserver: req.user ? (req.user.guilds.find(e => e.id === "402555684849451028") ? true : false) : false,
    logged: req.user ? true : false,
    verified: req.user ? ((req.user.guilds.find(e => e.id === "402555684849451028")) ? (getPermissions(req.user.guilds.find(e => e.id === "402555684849451028").permissions).has("ATTACH_FILES")) : (false)) : false,
  });
});

router.get('/rules', (req, res) => {
  res.render("wwdrules", {
    username: req.user ? req.user.username : "stranger",
    csrfToken: req.csrfToken(),
    avatar: req.user ? req.user.avatar : null,
    logged: req.user ? true : false
  });
});

router.get("/birthday-cards", (req, res) => {
  res.redirect(301, "/wwd/birthday-cards/2020/");
});

router.get("/birthday-cards/:year", async (req, res) => {
  if(req.params.year.length > 4) return res.status(400).send("Invalid year!");
  try {
    const year = Number(req.params.year);
    if (!year) return res.status(400).send("Invalid year!");
    const docs = await birthday.find({ published: true, year });
    if (!docs.length) return res.status(404).send("No cards found for the specified year");
    const tosee = new Map();

    for (let i in docs) {
      if (!docs[i].userID) continue;
      const user = await DiscordUser.findOne({ discordId: docs[i].userID });
      if (user) tosee.set(docs[i].userID, { username: user.username, avatar: utils.getAvatar(user), discordId: user.discordId });
    }
    res.render("birthdaycards", {
      username: req.user ? req.user.username : "stranger",
      avatar: req.user ? req.user.avatar : null,
      logged: Boolean(req.user),
      cards: docs,
      authors: tosee,
      year
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something happened! " + err);
  }
});

//END
router.use(isLogged);
///////////////////////////////////// LOGGED USERS //////////////////////////////////////
router.get("/appeal", async (req, res) => {
  try {
    const algo = await bans.findOne({ guildId: { $eq: "402555684849451028" }, userId: { $eq: req.user.discordId } });
    if (algo) return res.status(403).send("You already submitted your appeal");
    const banss = await utils.getGuildBans("402555684849451028")
    if (banss) {
      const ban = banss.find(e => e.user.id === req.user.discordId);
      if (ban) {
        res.status(200).render("bans", {
          username: req.user.username,
          csrfToken: req.csrfToken(),
          avatar: req.user.avatar,
          logged: true,
          ban
        })
      } else {
        res.status(403).send("You're not banned");
      }
    } else {
      res.status(500).send("Something happened!");
    }
  } catch (err) {
    res.status(500).send("Something happened" + err);
  }
});

router.post("/appeal", async (req, res) => {
  if (!req.body) return res.status(400).send("You haven't sent anything");
  if (!req.body.reason) return res.status(400).send("You have not put the reason");
  const esto = await utils.getGuildBans("402555684849451028");
  const ver = esto.find(e => e.user.id === req.user.discordId);
  if (!ver) return res.status(403).send("You're not banned");
  try {
    const algo = await bans.findOne({ guildId: "402555684849451028", memberId: req.user.discordId });
    if (algo) return res.status(403).send("You already submitted your appeal");
    const algo2 = new bans({
      guildId: "402555684849451028",
      userId: req.user.discordId,
      reason: req.body.reason,
      additional: req.body.additional || "*No additional*"
    })
    await algo2.save()
    res.status(201).render("appcompleted", {
      username: req.user.username,
      csrfToken: req.csrfToken(),
      avatar: req.user.avatar,
      logged: true,
    })
  } catch (err) {
    res.status(500).send("Something happened" + err);
  }
});

router.get("/wm/qualifiers", async (req, res) => {
  res.render('wmq', {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    logged: true,
  });
});
//END
router.use(isInWDD);
///////////////////////////////////// WWD MEMBERS //////////////////////////////////////
router.get("/yourroles", async (req, res) => {
  try {
    const response = await utils.getMemberRoles("402555684849451028", req.user.discordId);
    if (response) {
      res.render("yourroles", {
        username: req.user.username,
        csrfToken: req.csrfToken(),
        avatar: req.user.avatar,
        logged: true,
        roles: response
      })
    } else {
      res.status(500).send("Something happened!");
    }
  } catch (err) {
    console.log(err)
    res.status(500).send("Something happened! " + err);
  }
});
//END
router.use(isWWDVerified);
///////////////////////////////////// VERIFIED WWD MEMBERS //////////////////////////////////////
router.get('/wwr/submit', async (req, res) => {
  const msgDocument = await wwr.findOne({ author: req.user.discordId });
  if (msgDocument) return res.status(403).render('wwrsubmit', {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    logged: true,
    status: 403
  });
  res.render('wwrsubmit', {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    logged: true,
    status: 200
  });
})

router.post('/wwr/submit', async (req, res) => {
  try {
    if (req.body && req.body.title && req.body.desc) {
      if (req.body.title.length > 250) return res.status(400).render('wwrsubmit', {
        username: req.user.username,
        csrfToken: req.csrfToken(),
        avatar: req.user.avatar,
        logged: true,
        status: 400
      });
      if (req.body.desc.length > 2000) return res.status(400).render('wwrsubmit', {
        username: req.user.username,
        csrfToken: req.csrfToken(),
        avatar: req.user.avatar,
        logged: true,
        status: 400
      });
      const msgDocument = await wwr.findOne({ author: req.user.discordId });
      if (msgDocument) {
        return res.status(403).render('wwrsubmit', {
          username: req.user.username,
          csrfToken: req.csrfToken(),
          avatar: req.user.avatar,
          logged: true,
          status: 403
        });
      }
      await new wwr({
        author: req.user.discordId,
        title: req.body.title,
        description: req.body.desc,
        date: new Date(),
      }).save();
      const embed = new Discord.MessageEmbed()
        .setAuthor("New Wubbzy Wednesday idea")
        .setTitle(req.body.title)
        .setDescription(req.body.desc)
        .setColor("RANDOM")
        .addField("Author", `${req.user.username} / ${req.user.discordId} / <@${req.user.discordId}>`)
      await utils.createMessage("722902317896040551", { embed: embed });
      res.status(201).render('wwrsubmit', {
        username: req.user.username,
        csrfToken: req.csrfToken(),
        avatar: req.user.avatar,
        logged: true,
        status: 201
      });
    } else res.status(400).render('wwrsubmit', {
      username: req.user.username,
      csrfToken: req.csrfToken(),
      avatar: req.user.avatar,
      logged: true,
      status: 400
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('wwrsubmit', {
      username: req.user.username,
      csrfToken: req.csrfToken(),
      avatar: req.user.avatar,
      logged: true,
      status: 500
    });
  }
});
//END
router.get(isWWDAdmin);
///////////////////////////////////// WWD ADMINS //////////////////////////////////////
router.get('/wwr', async (req, res) => {
  const msgDocument = await wwr.find();
  if (req.query && req.query.delete) {
    if (!msgDocument[req.query.delete]) return res.status(404).redirect("/wwd/wwr");
    else await msgDocument[req.query.delete].deleteOne();
    return res.status(200).redirect("/wwd/wwr");
  }
  const tosee = new Map();
  for (let i in msgDocument) {
    const user = await DiscordUser.findOne({ discordId: msgDocument[i].author });
    if (user) tosee.set(msgDocument[i].author, user.username + " (" + user.discordId + ")");
  }
  res.render('wwr', {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    logged: true,
    ideas: msgDocument,
    authors: tosee
  })
})

router.get("/appeals", async (req, res) => {
  const banss = await bans.find();
  if (req.query && req.query.unban) {
    if (!banss[req.query.unban]) return res.status(404).redirect("/wwd/appeals");
    else {
      const doc = banss[req.query.unban];
      await fetch("https://discord.com/api/v6/guilds/402555684849451028/bans/" + banss[req.query.unban].userId, {
        method: "DELETE",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`
        }
      });
      await banss[req.query.unban].deleteOne();
      return res.status(200).redirect("/wwd/appeals");
    }
  }
  if (req.query && req.query.delete) {
    if (!banss[req.query.delete]) return res.status(404).redirect("/wwd/appeals");
    await banss[req.query.delete].deleteOne();
    return res.status(200).redirect("/wwd/appeals");
  }
  const tosee = new Map();
  for (let i in banss) {
    const user = await DiscordUser.findOne({ discordId: banss[i].userId });
    if (user) tosee.set(banss[i].userId, user.username + " (" + user.discordId + ")");

  }
  res.render('appeals', {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    logged: true,
    appeals: banss,
    authors: tosee
  })
})

/*
router.get("/birthday-cards/admin", isAuthorizedAdmin, async (req, res) => {
  const docs = await birthday.find({ published: false });
  const tosee = new Map();
  if(req.query && req.query.approve) {
    const doc = docs[req.query.approve]
    if(!doc) return res.status(404).redirect("/wwd/birthday-cards/admin/");
    if(doc.anon) {
      await doc.updateOne({ published: true });
      const embed = new Discord.MessageEmbed()
      .setTitle("New Wubbzy birthday card <:WubbzyParty:608094605296271382>")
      .setAuthor("Anonymous")
      .setDescription(Discord.Util.splitMessage(doc.card)[0] || "?")
      .setTimestamp()
      .setColor("RANDOM");
      if(doc.additional) {
        embed.addField("Additional", Discord.Util.splitMessage(doc.additional, { maxLength: 1000 })[0]);
      }
      console.log(await utils.createMessage("746852649248227328", {
        embed: embed
      }));
      return res.redirect("/wwd/birthday-cards/admin/")
    } else {
      const user = await DiscordUser.findOne({ discordId: doc.userID });
      await doc.updateOne({ published: true });
      const embed = new Discord.MessageEmbed()
      .setTitle("New Wubbzy birthday card <:WubbzyParty:608094605296271382>")
      .setAuthor(user.username, utils.getAvatar(user))
      .setDescription(Discord.Util.splitMessage(doc.card)[0] || "?")
      .setTimestamp()
      .setColor("RANDOM");
      if(doc.additional) {
        embed.addField("Additional", Discord.Util.splitMessage(doc.additional, { maxLength: 1000 })[0] || "?");
      }
      console.log(await utils.createMessage("746852649248227328", {
        embed: embed
      }))
      return res.redirect("/wwd/birthday-cards/admin/")
    }
  } else if(req.query && req.query.delete) {
    const doc = docs[req.query.delete]
    if(!doc) return res.status(404).redirect("/wwd/birthday-cards/admin/");
    await doc.deleteOne();
    return res.redirect("/wwd/birthday-cards/admin/");
  }
  for(let i in docs) {
    const user = await DiscordUser.findOne({ discordId: docs[i].userID });
    if(user) tosee.set(docs[i].userID, { username: user.username, avatar: utils.getAvatar(user), discordId: user.discordId });
  }
  res.render("birthdayadmin", {
    username: req.user.username,
    csrfToken: req.csrfToken(),
    avatar: req.user.avatar,
    logged: true,
    cards: docs,
    authors: tosee
  });
})

router.get("/birthday-cards/submit", isAuthorized, async (req, res) => {
  try {
    const algo = await birthday.findOne({ userID: req.user.discordId })
    if (algo) return res.status(403).render("birthdaysubmit", {
      username: req.user.username,
csrfToken: req.csrfToken(),
      avatar: req.user.avatar,
      logged: true,
      status: 403
    });
    else {
      res.status(200).render("birthdaysubmit", {
        username: req.user.username,
        csrfToken: req.csrfToken(),
        avatar: req.user.avatar,
        logged: true,
        status: 200
      });
    }
  } catch (err) {
    res.status(500).send("Something happened" + err)
  }
});

router.post("/birthday-cards/submit", isAuthorized, async (req, res) => {
  if (!req.user) return res.status(401).redirect("/");
  if (!req.body) return res.status(400).send("You haven't sent anything");
  if (!req.body.card) return res.status(400).send("You have not put the reason");
  try {
    const algo = await birthday.findOne({ userID: req.user.discordId });
    if (algo) return res.status(403).send("You already submitted your birthday card");
    const doc = await birthday.create({
      userID: req.user.discordId,
      card: req.body.card,
      additional: req.body.additional,
      anon: req.body.anon ? true : false,
      published: false
    });
    const embed = new Discord.MessageEmbed()
    .setTitle("New Wubbzy Birthday Card")
    .setAuthor(req.user.username, utils.getAvatar(req.user))
    .setDescription(Discord.Util.splitMessage(doc.card)[0] || "?")
    .setTimestamp()
    if(doc.additional) {
      embed.addField("Additional", Discord.Util.splitMessage(doc.additional, { maxLength: 1000 })[0]);
    }
    embed.addField("Requested anonymity?", doc.anon ? "Yes" : "No")
    .addField("URL", "https://gidgetbot.herokuapp.com/wwd/birthday-cards/admin")
    
    await utils.createMessage("746852433644224562", {
      embed: embed
    })
    res.status(201).render("birthdaycompleted", {
      username: req.user.username,
      csrfToken: req.csrfToken(),
      avatar: req.user.avatar,
      logged: true,
    })
  } catch (err) {
    res.status(500).send("Something happened! " + err);
  }
})
*/
module.exports = router;