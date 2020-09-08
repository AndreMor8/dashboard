const permissions = require("./permissions");
const fetch = require("node-fetch");
const OAuth2 = require("../models/OAuth2Credentials");
const CryptoJS = require("crypto-js");
const api = "https://discord.com/api/v6";
module.exports = {
  getPermissions: function(perm) {
    const permissionMap = new Map();
    for (const [key, value] of Object.entries(permissions)) {
      if ((perm & value) == value) permissionMap.set(key, value);
    }
    return permissionMap;
  },
  getGuilds: function(botGuilds, userGuilds) {
    if(!Array.isArray(botGuilds)) {
      console.error(botGuilds)
      throw new Error('"botGuilds" is not an Array');
    };
    if(!Array.isArray(userGuilds)) {
      console.error(userGuilds);
      throw new Error('"userGuilds" is not an Array');
    };
    const guildMemberPermissions = new Map();
    userGuilds.forEach(guild => {
      const perm = this.getPermissions(guild.permissions);
      guildMemberPermissions.set(guild.id, perm);
    });
    const toshow = userGuilds.filter(e => {
      if (!botGuilds.map(r => r.id).includes(e.id)) return;
      const p = guildMemberPermissions.get(e.id);
      if (p && p.get("ADMINISTRATOR")) return true;
      else return false;
    });
    return toshow;
  },
  getBotGuilds: async function () {
    const res = await fetch(`${api}/users/@me/guilds`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    });
    return res.json();
  },
  getUserGuilds: async function (discordId) {
    const algo = await OAuth2.findOne({ discordId });
    if(!algo) throw new Error("No credentials found! Try relogin");
    const eat = algo.get('accessToken');
    const decrypted = this.decrypt(eat);
    const acc = decrypted.toString(CryptoJS.enc.Utf8)
    const res = await fetch(`${api}/users/@me/guilds`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${acc}`
      }
    });
    return res.json();
  },
  getMember: async function(guildID, userID) {
    const res = await fetch(`${api}/guilds/${guildID}/members/${userID}`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    });
    return res.json();
  },
  getGuildRoles: async function (guildID) {
    const res = await fetch(`${api}/guilds/${guildID}/roles`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    });
    return res.json();
  },
  getMemberRoles: async function(guildID, memberID) {
    const member = await this.getMember(guildID, memberID);
    if(member.code) return member;
    const roles = await this.getGuildRoles(guildID);
    const toshow = roles.filter(e => member.roles.includes(e.id));
    return toshow;
  },
  getGuildBans: async function(guildID) {
    const res = await fetch(`${api}/guilds/${guildID}/bans`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    })
    return res.json();
  },
  getGuildMembers: async function(guildID, limit = 1, after = 0) {
    const res = await fetch(`${api}/guilds/${guildID}/members?limit=${limit}&after=${after}`, {
      method: "GET",
      headers: {
        "Authorization": `Bot ${process.env.DISCORD_TOKEN}`
      }
    });
    return res.json();
  },
  createMessage: async function(channelID, content) {
    const res = await fetch(`${api}/channels/${channelID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(content)
    });
    return res.json();
  },
  getGuildChannels: async function(guildID) {
    const res = await fetch(`${api}/guilds/${guildID}/channels`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    });
    return res.json();
  },
  encrypt: function(token) {
    return CryptoJS.AES.encrypt(token, process.env.VERYS)
  },
  decrypt: function (etoken) {
    return CryptoJS.AES.decrypt(etoken, process.env.VERYS)
  },
  getAvatar: function(User) {
    if(User.avatar) {
      if(User.avatar.startsWith("a_")) return `https://cdn.discordapp.com/avatars/${User.discordId}/${User.avatar}.gif?size=4096`
      else return `https://cdn.discordapp.com/avatars/${User.discordId}/${User.avatar}.png?size=4096`
    } else return `https://cdn.discordapp.com/embed/avatars/${User.username.split("#")[1] % 5}.png`
  },
  urlRegex: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/gm
};
