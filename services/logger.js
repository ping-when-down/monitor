"use strict";

/* * * * * */
/* LOGGER */
/* * */

/* * */
/* IMPORTS */
const config = require("config");
const loggerIsOn = config.get("logger-is-on");

module.exports = function (content) {
  if (loggerIsOn) content ? console.log(content) : console.log();
};
