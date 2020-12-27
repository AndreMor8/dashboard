const DiscordUser = require("../models/DiscordUser")
const userpetitions = require("../models/userpetitions");
const router = require('express').Router();
const utils = require("../utils/utils");
const { MessageEmbed } = require("discord.js");
const cosas = ["577000793094488085"];

router.get("/", (req, res) => {
    res.render("home", {
        username: req.user ? req.user.username : "stranger",
        csrfToken: req.csrfToken(),
        avatar: req.user ? req.user.avatar : null,
        logged: req.user ? true : false,
        antixss,
        antixsslinks
    });
});

router.get("/thanks", (req, res) => {
    res.render("thanks", {
        username: req.user ? req.user.username : "stranger",
        csrfToken: req.csrfToken(),
        avatar: req.user ? req.user.avatar : null,
        logged: req.user ? true : false,
        antixss,
        antixsslinks
    });
});

router.get("/feedback", isAuthorized, (req, res) => {
    res.render("feedback", {
        username: req.user.username,
        csrfToken: req.csrfToken(),
        avatar: req.user ? req.user.avatar : null,
        logged: true,
        antixss,
        antixsslinks
    });
});

router.post("/feedback", isAuthorized, async (req, res) => {
    if (![0, 1, 2, "0", "1", "2"].includes(req.body.type)) return res.sendStatus(400);
    if (!req.body.text) return res.sendStatus(400);
    if (req.body.text.length > 1950) return res.statusCode(400);
    if (typeof req.body.anon !== "boolean") return res.sendStatus(400);
    const text = req.body.text;
    const anon = req.body.anon;
    const type = Number(req.body.type);
    let typetext;
    if (type === 0) typetext = "Suggestion";
    if (type === 1) typetext = "Normal feedback";
    if (type === 2) typetext = "Report";
    let color;
    if (type === 0) color = "GREEN";
    if (type === 1) color = "BLUE";
    if (type === 2) color = "RED";
    let algo;
    if (type !== 1) algo = await userpetitions.create({ userID: req.user.discordId, type, text, anon });
    const embed = new MessageEmbed()
    .setTitle("A new comment has been posted!")
    .setDescription(text)
    .setColor(color)
    if(anon) embed.setAuthor("Anonymous")
    else embed.setAuthor(req.user.username, utils.getAvatar(req.user))
    embed.addField("Type", typetext)
    .addField("ID", (algo ? algo.id : "*It's a normal comment, so no need to save to DB*"))
    const m = await utils.createMessage("767287563735138335", { embed });
    res.sendStatus(200);
});

router.get("/pending-comments", async (req, res) => {
    const comments = await userpetitions.find();
    const tosee = new Map();

    for (let i in comments) {
        if (!comments[i].userID) continue;
        const user = await DiscordUser.findOne({ discordId: comments[i].userID });
        if (user) tosee.set(comments[i].userID, { username: user.username, avatar: utils.getAvatar(user), discordId: user.discordId });
    }
    res.status(200).render("comments", {
        username: req.user ? req.user.username : "stranger",
        csrfToken: req.csrfToken(),
        avatar: req.user ? req.user.avatar : null,
        logged: req.user ? true : false,
        antixss,
        antixsslinks,
        admin: req.user ? cosas.includes(req.user.discordId) : false,
        comments,
        authors: tosee
    });
});

router.delete("/pending-comments", async (req, res) => {
    if (!cosas.includes(req.user.discordId)) return res.status(403).send("You must be a Gidget's bot developer to do this");
    if (!req.body.id) return res.sendStatus(400);
    if (typeof req.body.d !== "boolean") return res.sendStatus(400);
    const doc = await userpetitions.findById(req.body.id);
    if (doc && [0, 2].includes(doc.type)) {
        const d = req.body.d;
        let text = req.body.message;
        if (d && !req.body.message) return res.sendStatus(400);
        if (req.body.message) {
            if (doc.type === 2) text = `Your report ID ${doc._id} was ${d ? "approved" : "rejected"}: ${req.body.message}`;
            else if (doc.type === 0) text = `Your suggestion ID ${doc._id} was ${d ? "approved" : "rejected"}: ${req.body.message}`;
            //Message DM
            const dm = await utils.createDM(doc.userID);
            await utils.createMessage(dm.id, { content: text });
            await utils.createMessage("767287563735138335", { embed: new MessageEmbed().setTitle(`${d ? "Approved" : "Rejected"} comment`).addField("ID", doc._id).addField("Reason", req.body.message) })
        }
        await doc.deleteOne();
        res.sendStatus(200);
    } else res.sendStatus(404);
})

router.get("/andremor", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const response = await utils.getUser("577000793094488085");
    if (!response.message) return res.status(200).send(`${response.username}#${response.discriminator}`);
    else return res.status(500).send("AndreMor");
});

router.get("/wwd", (req, res) => {
    res.redirect(301, "https://wubb.ga");
});

function isAuthorized(req, res, next) {
    if (req.user) {
        next();
    }
    else {
        res.redirect("/");
    }
}

module.exports = router;