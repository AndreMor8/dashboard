const permissions = require("./permissions");
const fetch = require("node-fetch");
let gcache;

module.exports = {
  getPermissions: function(perm) {
    const permissionMap = new Map();
    for (const [key, value] of Object.entries(permissions)) {
      if ((perm & value) == value) permissionMap.set(key, value);
    }
    return permissionMap;
  },
  getGuilds: async function getGuilds(guilds) {
    if (gcache) return gcache;
    else setTimeout(() => (gcache = undefined), 120000);
    const guildMemberPermissions = new Map();
    const ext = await (await fetch(process.env.FETCH + "?guilds=1",
      {
        method: "GET",
        headers: {
          pass: process.env.ACCESS
        }
      }
    )).json();
    guilds.forEach(guild => {
      const perm = this.getPermissions(guild.permissions);
      guildMemberPermissions.set(guild.id, perm);
    });
    const toshow = guilds.filter(e => {
      if (!ext.guilds.includes(e.id)) return;
      const p = guildMemberPermissions.get(e.id);
      if (p && p.get("ADMINISTRATOR")) return true;
      else return false;
    });
    gcache = toshow;
    return toshow;
  }
};
