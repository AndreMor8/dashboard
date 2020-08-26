const permissions = require("./permissions");
const fetch = require("node-fetch");
const OAuth2 = require("../models/OAuth2Credentials");
const CryptoJS = require("crypto-js");
const api = "https://discord.com/api/v6";
const isImageURL = require('image-url-validator');
module.exports = {
  getPermissions: function(perm) {
    const permissionMap = new Map();
    for (const [key, value] of Object.entries(permissions)) {
      if ((perm & value) == value) permissionMap.set(key, value);
    }
    return permissionMap;
  },
  getGuilds: async function(guilds) {
    if(!Array.isArray(guilds)) {
      console.error(guilds)
      throw new Error(guilds)
    };
    const guildMemberPermissions = new Map();
    const ext = await (await fetch(`${api}/users/@me/guilds`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    })).json();
    if(!Array.isArray(ext)) {
      console.log(ext);
      throw new Error(ext)
    }
    guilds.forEach(guild => {
      const perm = this.getPermissions(guild.permissions);
      guildMemberPermissions.set(guild.id, perm);
    });
    const toshow = guilds.filter(e => {
      if (!ext.map(r => r.id).includes(e.id)) return;
      const p = guildMemberPermissions.get(e.id);
      if (p && p.get("ADMINISTRATOR")) return true;
      else return false;
    });
    return toshow;
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
    return await res.json();
  },
  getMember: async function(guildID, userID) {
    const res = await fetch(`${api}/guilds/${guildID}/members/${userID}`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    });
    return await res.json();
  },
  getGuildRoles: async function (guildID) {
    const res = await fetch(`${api}/guilds/${guildID}/roles`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    });
    return await res.json();
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
    return await res.json();
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
    return await res.json();
  },
  encrypt: function(token) {
    return CryptoJS.AES.encrypt(token, process.env.VERYS)
  },
  decrypt: function (etoken) {
    return CryptoJS.AES.decrypt(etoken, process.env.VERYS)
  },
  getAvatar: async function(User) {
    const defaultAvatar = `https://cdn.discordapp.com/embed/avatars/${User.username.split("#")[1] % 5}.png`;
    if(User.avatar) {
      const avatar = `https://cdn.discordapp.com/avatars/${User.discordId}/${User.avatar}.png?size=4096`;
      if(isImageURL(avatar)) return avatar;
      else return defaultAvatar;
  }
  }
};
