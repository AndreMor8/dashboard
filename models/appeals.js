const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    reason: { type: String, required: true },
    additional: { type: String }
});

const MessageModel = module.exports = mongoose.model('appeals', MessageSchema);