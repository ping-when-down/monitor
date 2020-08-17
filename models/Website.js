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
module.exports = mongoose.model(
  "Website",
  new mongoose.Schema({
    title: {
      type: String,
      maxlength: 30,
      required: true,
    },
    url: {
      type: String,
      maxlength: 100,
      required: true,
    },
    interval: {
      type: Number,
      required: true,
    },
    statusCode: {
      type: Number,
      maxlength: 3,
      required: true,
    },
    statusMessage: {
      type: String,
      maxlength: 30,
      required: true,
    },
    responseTime: {
      type: Number,
      maxlength: 5,
      required: true,
    },
    lastChecked: {
      type: Date,
    },
  })
);
