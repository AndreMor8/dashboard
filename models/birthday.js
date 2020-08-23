const mongoose = require("mongoose");

const thing = new mongoose.Schema({
    userID: { type: String },
    card: { type: String, required: true },
    additional: { type: String },
    published: { type: Boolean, default: false },
    anon: { type: Boolean, default: false }
})

module.exports = mongoose.model("birthday", thing);