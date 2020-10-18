//0 = suggestion, 1 = bug/report
const mongoose = require("mongoose");
const sch = new mongoose.Schema({
    userID: { type: String, required: true },
    type: { type: Number, default: 0 },
    text: { type: String, required: true },
    anon: { type: Boolean, default: false }
});
module.exports = mongoose.model("petition", sch);