const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
module.exports = async function() {
    await mongoose.connect(`mongodb+srv://${process.env.MDB_PATH}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, user: process.env.MDB_USER, pass: process.env.MDB_PASS, dbName: process.env.MDB_DBNAME });
    console.log("Connected to the database");
}