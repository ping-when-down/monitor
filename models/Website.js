"use strict";

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
    active: {
      type: Boolean,
      required: true,
    },
    index: {
      type: Number,
      maxlength: 3,
    },
    https: {
      type: Boolean,
      required: true,
    },
    host: {
      type: String,
      maxlength: 100,
      required: true,
    },
    statusCode: {
      type: String,
      maxlength: 30,
    },
    statusMessage: {
      type: String,
      maxlength: 100,
    },
    responseTime: {
      type: Number,
      maxlength: 5,
    },
    lastChecked: {
      type: String,
      maxlength: 40,
    },
    lastDown: {
      type: String,
      maxlength: 40,
    },
  })
);
