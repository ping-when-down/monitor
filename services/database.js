/* * */
/* * */
/* * * * * */
/* CONNECTION TO MONGODB */
/* * */

/* * */
/* IMPORTS */
const config = require("config");
const mongoose = require("mongoose");

module.exports = async function () {
  await mongoose
    .connect(config.get("database-connection-string"), {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true, // Temporary fixes for deprecation warnings.
    })
    .then(() => console.log("Connected to MongoDB."))
    .catch((error) => {
      console.log(
        "Connection to MongoDB failed.",
        "At database.js > mongoose.connect()",
        error
      );
    });
};
