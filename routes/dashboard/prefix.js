const prefix = require("../../models/prefix.js");
module.exports = {
  get: async (guildID) => {
  let msgDocument = await prefix.findOne({ guildId: guildID });
        if (msgDocument) return msgDocument;
        else {
          return await prefix.create({
            guildId: guildID,
            prefix: "g%"
          });
        }
},
  post: async (req) => {
    let msgDocument = await prefix.findOne({ guildId: req.params.guildID })
        if(msgDocument) {
         await msgDocument.updateOne({ prefix: req.body.prefix });
        } else {
          await prefix.create({
            guildId: req.params.guildID,
            prefix: req.body.prefix
          });
        }
  }
}