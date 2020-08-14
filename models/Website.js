/* * */
/* * */
/* * * * * */
/* WEBSITE */
/* * */

/* * */
/* IMPORTS */
const mongoose = require("mongoose");

/* * */
/* Schema for MongoDB ["Store"] Object */
exports.Website = mongoose.model(
  "Website",
  new mongoose.Schema({
    title: {
      type: String,
      maxlength: 30,
      required: true,
    },
    url: {
      type: String,
      maxlength: 30,
      required: true,
    },
    interval: {
      type: Number,
      required: true,
    },
  })
);
