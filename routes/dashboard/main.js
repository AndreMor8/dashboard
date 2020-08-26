const levels = require("../../models/levelconfig.js");
const util = require("../../utils/utils");
const fetch = require("node-fetch");
const pf = require("./prefix.js");
const lf = require('./levels.js');
const cp = require("./cp.js");
module.exports = {
  get: async (req, res) => {
    try {
      if (req.params && req.params.guildID && req.params.config) {
        await new Promise((s, r) => setTimeout(s, 1000));
        const guilds = await util.getUserGuilds(req.user.discordId)
        await new Promise((s, r) => setTimeout(s, 1000));
        const toshow = await util.getGuilds(guilds);;
      const guild = toshow.find(e => e.id === req.params.guildID);
      if (!guild) return res.status(403).send("That ID is not in your server list...");
      else {
        /* Things for options */
        let data;
        if (req.params.config === "levels") {
          data = await lf.get(req.params.guildID)
        }
        if (req.params.config === "prefix") {
          data = await pf.get(req.params.guildID);
        }
        if(req.params.config === "cp") {
          data = await cp.get(req.params.guildID);
        }
        if (req.params.config === "cp" && req.query && req.query.delete) {
          await cp.delete(req.params.guildID, req.query.delete);
          await fetch(process.env.FETCH + "?delete=" + req.params.guildID, {
      method: "GET",
      headers: {
        pass: process.env.ACCESS
      }
    });
          return res.redirect("/dashboard/" + req.params.guildID + "/cp")
        }
  
        /* Render the data to front-end */
        res.status(200).render("dashboard1", {
          username: req.user.username,
          avatar: req.user.avatar,
          discordId: req.user.discordId,
          guilds: guilds,
          toshow: toshow,
          focus: req.params.guildID,
          logged: true,
          option: req.params.config,
          data: data
        });
      }
    } else res.sendStatus(200);
    } catch (err) {
      res.status(500).send("Something happened! " + err);
    }
  },
  post: async (req, res) => {
   try {
    if (req.params && req.params.guildID && req.params.config) {
      await new Promise((s, r) => setTimeout(s, 1000));
       const guilds = await util.getUserGuilds(req.user.discordId)
       await new Promise((s, r) => setTimeout(s, 1000));
       const toshow = await util.getGuilds(guilds);;
      const guild = toshow.find(e => e.id === req.params.guildID);
      if (!guild)
        return res.status(403).send("That ID is not in your server list...");
      else {
        /* Things for options */
        if (req.params.config === "levels" && req.body && req.body.system && req.body.notif) {
          await lf.post(req);
        }
        if (req.params.config === "prefix" && req.body) {
          await pf.post(req);
        }
        if (req.params.config === "cp" && req.body.match && req.body.response) {
          await cp.post(req);
        }
        if (req.params.config === "cp" && req.body.id) {
          await cp.delete(req.params.guildID, req.body.id);
        }
        await fetch(process.env.FETCH + "?delete=" + req.params.guildID, {
      method: "GET",
      headers: {
        pass: process.env.ACCESS
      }
    });
        /* Render the data to front-end */
        res.redirect("/dashboard/" + req.params.guildID + "/" + req.params.config)
      }
    } else
      res.sendStatus(200);
   } catch (err) {
     res.status(500).send("Something happened! " + err);
   }
}             
}