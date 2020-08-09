const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
module.exports = mongoose.connect(process.env.MDB_PATH, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, user: process.env.MDB_USER, pass: process.env.MDB_PASS, dbName: process.env.MDB_DBNAME });