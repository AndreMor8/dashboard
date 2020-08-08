const cp = require("../../models/customresponses.js");
module.exports = {
  get: async guildID => {
    let msgDocument = await cp.findOne({ guildId: guildID });
    if (msgDocument) return msgDocument;
    else {
      return {
        guildId: guildID,
        responses: {}
      }
    }
  },
  post: async req => {
    let msgDocument = await cp.findOne({ guildId: req.params.guildID });
    if (msgDocument) {
      let { responses } = msgDocument;
      const files = [];
      if (req.body.link) {
        files.push(req.body.link);
      }
      responses[req.body.match] = { content: req.body.response, files: files };
      msgDocument.updateOne({ responses: responses });
    } else {
      const responses = {};
      const files = [];
      if (req.body.link) {
        files.push(req.body.link);
      }
      responses[req.body.match] = { content: req.body.response, files: files };
      const tosave = new cp({
        guildId: req.params.guildID,
        responses: responses
      });
      await tosave.save();
    }
  },
  delete: async (guildID, value) => {
    let msgDocument = await cp.findOne({ guildId: guildID });
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
    }
  },
};
