const permissions = require("./permissions");
const fetch = require("node-fetch");
const OAuth2 = require("../models/OAuth2Credentials");
const CryptoJS = require("crypto-js");
const api = "https://discord.com/api/v6";
const cache = new Map();
setInterval(() => {
  cache.clear();
}, 240000);
module.exports = {
  getUser: async function (userId) {
    const algo = cache.get(`user-${userId}`);
    if(algo) return algo;
    const res = await fetch(`${api}/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    });
    if (res.status === 429) {
      const json = await res.json();
      await new Promise(s => setTimeout(s, (Math.floor(parseInt(json.retry_after)))));
      return this.getUser(userId);
    }
    const retrys = res.headers.get("X-RateLimit-Remaining");
    const retryafter = res.headers.get("X-RateLimit-Reset-After");
    if (!isNaN(retrys) && !isNaN(retryafter)) {
      if (parseInt(retrys) < 1) await new Promise(s => setTimeout(s, (Math.floor(parseInt(retryafter) * 1000) + 0.5)));
    }
    const final = await res.json();
    if(res.ok) cache.set(`user-${userId}`, final)
    return final;
  },
  getPermissions: function (perm) {
    const permissionMap = new Map();
    for (const [key, value] of Object.entries(permissions)) {
      if ((perm & value) == value) permissionMap.set(key, value);
    }
    return permissionMap;
  },
  getGuilds: function (botGuilds, userGuilds) {
    if (!Array.isArray(botGuilds)) {
      console.error(botGuilds)
      throw new Error('"botGuilds" is not an Array');
    };
    if (!Array.isArray(userGuilds)) {
      console.error(userGuilds);
      throw new Error('"userGuilds" is not an Array');
    };
    const guildMemberPermissions = new Map();
    userGuilds.forEach(guild => {
      const perm = this.getPermissions(guild.permissions);
      guildMemberPermissions.set(guild.id, perm);
    });
    const toshow = userGuilds.filter(e => {
      if (!botGuilds.includes(e.id)) return;
      const p = guildMemberPermissions.get(e.id);
      if (p && p.get("ADMINISTRATOR")) return true;
      else return false;
    });
    return toshow;
  },
  getBotGuilds: async function () {
    const res = await fetch(process.env.FETCH + "guilds", {
      method: "GET",
      headers: {
        "pass": process.env.ACCESS
      }
    });
    if(res.ok) return await res.json();
    else throw new Error(`Status code returned ${res.status} (${res.statusText})`);
  },
  getUserGuilds: async function (discordId) {
    const esto = cache.get(`userGuilds-${discordId}`);
    if(esto) return esto;
    const algo = await OAuth2.findOne({ discordId });
    if (!algo) throw new Error("No credentials found! Try relogin");
    const eat = algo.get('accessToken');
    const decrypted = this.decrypt(eat);
    const acc = decrypted.toString(CryptoJS.enc.Utf8)
    const res = await fetch(`${api}/users/@me/guilds`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${acc}`
      }
    });
    if (res.status === 429) {
      const json = await res.json();
      await new Promise(s => setTimeout(s, (Math.floor(parseInt(json.retry_after)))));
      return this.getUserGuilds(discordId);
    }
    const retrys = res.headers.get("X-RateLimit-Remaining");
    const retryafter = res.headers.get("X-RateLimit-Reset-After");
    if (!isNaN(retrys) && !isNaN(retryafter)) {
      if (parseInt(retrys) < 1) await new Promise(s => setTimeout(s, (Math.floor(parseInt(retryafter) * 1000) + 0.5)));
    }
    const final = await res.json();
    if(res.ok) cache.set(`userGuilds-${discordId}`, final);
    return final;
  },
  getMember: async function (guildID, userID) {
    const res = await fetch(`${api}/guilds/${guildID}/members/${userID}`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    });
    if (res.status === 429) {
      const json = await res.json();
      await new Promise(s => setTimeout(s, (Math.floor(parseInt(json.retry_after)))));
      return this.getMember(guildID, userID);
    }
    const retrys = res.headers.get("X-RateLimit-Remaining");
    const retryafter = res.headers.get("X-RateLimit-Reset-After");
    if (!isNaN(retrys) && !isNaN(retryafter)) {
      if (parseInt(retrys) < 1) await new Promise(s => setTimeout(s, (Math.floor(parseInt(retryafter) * 1000) + 0.5)));
    }
    return res.json();
  },
  getGuildRoles: async function (guildID) {
    const res = await fetch(`${api}/guilds/${guildID}/roles`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    });
    if (res.status === 429) {
      const json = await res.json();
      await new Promise(s => setTimeout(s, (Math.floor(parseInt(json.retry_after)))));
      return this.getGuildRoles(guildID);
    }
    const retrys = res.headers.get("X-RateLimit-Remaining");
    const retryafter = res.headers.get("X-RateLimit-Reset-After");
    if (!isNaN(retrys) && !isNaN(retryafter)) {
      if (parseInt(retrys) < 1) await new Promise(s => setTimeout(s, (Math.floor(parseInt(retryafter) * 1000) + 0.5)));
    }
    return res.json();
  },
  getMemberRoles: async function (guildID, memberID) {
    const member = await this.getMember(guildID, memberID);
    if (member.code) return member;
    const roles = await this.getGuildRoles(guildID);
    const toshow = roles.filter(e => member.roles.includes(e.id));
    return toshow;
  },
  getGuildBans: async function (guildID) {
    const res = await fetch(`${api}/guilds/${guildID}/bans`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    });
    if (res.status === 429) {
      const json = await res.json();
      await new Promise(s => setTimeout(s, (Math.floor(parseInt(json.retry_after)))));
      return this.getGuildBans(guildID);
    }
    const retrys = res.headers.get("X-RateLimit-Remaining");
    const retryafter = res.headers.get("X-RateLimit-Reset-After");
    if (!isNaN(retrys) && !isNaN(retryafter)) {
      if (parseInt(retrys) < 1) await new Promise(s => setTimeout(s, (Math.floor(parseInt(retryafter) * 1000) + 0.5)));
    }
    return res.json();
  },
  getGuildMembers: async function (guildID, limit = 1, after = 0) {
    const res = await fetch(`${api}/guilds/${guildID}/members?limit=${limit}&after=${after}`, {
      method: "GET",
      headers: {
        "Authorization": `Bot ${process.env.DISCORD_TOKEN}`
      }
    });
    if (res.status === 429) {
      const json = await res.json();
      await new Promise(s => setTimeout(s, (Math.floor(parseInt(json.retry_after)))));
      return this.getGuildMembers(guildID, limit, after);
    }
    const retrys = res.headers.get("X-RateLimit-Remaining");
    const retryafter = res.headers.get("X-RateLimit-Reset-After");
    if (!isNaN(retrys) && !isNaN(retryafter)) {
      if (parseInt(retrys) < 1) await new Promise(s => setTimeout(s, (Math.floor(parseInt(retryafter) * 1000) + 0.5)));
    }
    return res.json();
  },
  createMessage: async function (channelID, content) {
    const res = await fetch(`${api}/channels/${channelID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(content)
    });
    if (res.status === 429) {
      const json = await res.json();
      await new Promise(s => setTimeout(s, (Math.floor(parseInt(json.retry_after)))));
      return this.createMessage(channelID, content);
    }
    const retrys = res.headers.get("X-RateLimit-Remaining");
    const retryafter = res.headers.get("X-RateLimit-Reset-After");
    if (!isNaN(retrys) && !isNaN(retryafter)) {
      if (parseInt(retrys) < 1) await new Promise(s => setTimeout(s, (Math.floor(parseInt(retryafter) * 1000) + 0.5)));
    }
    return await res.json();
  },
  getGuildChannels: async function (guildID) {
    const res = await fetch(`${api}/guilds/${guildID}/channels`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    });
    if (res.status === 429) {
      const json = await res.json();
      await new Promise(s => setTimeout(s, (Math.floor(parseInt(json.retry_after)))));
      return this.getGuildChannels(guildID);
    }
    const retrys = res.headers.get("X-RateLimit-Remaining");
    const retryafter = res.headers.get("X-RateLimit-Reset-After");
    if (!isNaN(retrys) && !isNaN(retryafter)) {
      if (parseInt(retrys) < 1) await new Promise(s => setTimeout(s, (Math.floor(parseInt(retryafter) * 1000) + 0.5)));
    }
    return res.json();
  },
  encrypt: function (token) {
    return CryptoJS.AES.encrypt(token, process.env.VERYS)
  },
  decrypt: function (etoken) {
    return CryptoJS.AES.decrypt(etoken, process.env.VERYS)
  },
  getAvatar: function (User) {
    if (User.avatar) {
      if (User.avatar.startsWith("a_")) return `https://cdn.discordapp.com/avatars/${User.discordId}/${User.avatar}.gif?size=4096`
      else return `https://cdn.discordapp.com/avatars/${User.discordId}/${User.avatar}.png?size=4096`
    } else return `https://cdn.discordapp.com/embed/avatars/${User.username.split("#")[1] % 5}.png`
  },
  createDM: async function (recipient_id) {
    const res = await fetch(`${api}/users/@me/channels`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipient_id })
    });
    if (res.status === 429) {
      const json = await res.json();
      await new Promise(s => setTimeout(s, (Math.floor(parseInt(json.retry_after)))));
      return this.createDM(recipient_id);
    }
    const retrys = res.headers.get("X-RateLimit-Remaining");
    const retryafter = res.headers.get("X-RateLimit-Reset-After");
    if (!isNaN(retrys) && !isNaN(retryafter)) {
      if (parseInt(retrys) < 1) await new Promise(s => setTimeout(s, (Math.floor(parseInt(retryafter) * 1000) + 0.5)));
    }
    return res.json();
  },
  urlRegex: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/gm
};
