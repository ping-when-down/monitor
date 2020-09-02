"use strict";

/* * * * * */
/* PING WHEN DOWN */
/* * */

/* * */
/* IMPORTS */
const config = require("config");
const database = require("./services/database");
const monitor = require("./services/monitor");
const logger = require("./services/logger");
const Website = require("./models/Website");

/* * *
 * MONITOR
 */
(async () => {
  logger();
  logger("* * * * * * * * * * * * * * * * * *");
  logger("* * PING WHEN DOWN ---- MONITOR * *");
  logger("* * * * * * * * * * * * * * * * * *");
  logger();

  const monitorIsOn = config.get("monitor-is-on");
  const startTime = process.hrtime();

  // If monitor is off
  if (!monitorIsOn) return logger("Monitor is OFF.");
  else logger("Starting...");

  // Connect to the database
  await database.connect();

  // Get all websites from the database.
  logger("Fetching from database...");
  const websites = await Website.find({});

  // If there are no websites to monitor, log and return.
  if (!websites.length) return logger("No websites to monitor.");
  else logger("Starting monitor for " + websites.length + " websites.");

  // For each website initiate monitoring
  for (const website of websites) await monitor.start(website);

  logger();
  logger("- - - - - - - - - - - - - - - - - -");
  logger("Shutting down...");

  await database.disconnect();

  logger("Operation took " + getDuration(startTime) / 1000 + " seconds.");
  logger("- - - - - - - - - - - - - - - - - -");
  logger();
})();

/* * */
/* At program initiation all websites are retrieved from the database */
/* and one ping-monitor instance is set up for each. */
const getDuration = (startTime) => {
  const interval = process.hrtime(startTime);
  return parseInt(
    // seconds -> miliseconds +
    interval[0] * 1000 +
      // + nanoseconds -> miliseconds
      interval[1] / 1000000
  );
};
