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
    index: {
      type: Number,
      maxlength: 3,
    },
    title: {
      type: String,
      maxlength: 30,
      required: true,
    },
    protocol: {
      type: String,
      maxlength: 100,
      required: true,
    },
    host: {
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
    },
    statusMessage: {
      type: String,
      maxlength: 30,
    },
    responseTime: {
      type: Number,
      maxlength: 5,
    },
    lastChecked: {
      type: Date,
    },
  })
);
