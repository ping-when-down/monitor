"use strict";

/* * * * * */
/* MONITOR */
/* * */

/* * */
/* IMPORTS */
const config = require("config");
const got = require("got");
const notifications = require("./notifications");
const logger = require("./logger");

/* * */
/* At program initiation all websites are retrieved from the database */
/* and one ping-monitor instance is set up for each. */
exports.start = async (website) => {
  logger();
  logger("---------------------------------------------------");

  // Check if website is active
  if (!website.active) {
    logger(website.title + " is off.");
    return logger("---------------------------------------------------");
  }

  logger("Website: " + website.title);
  logger("URL: " + (website.https ? "https://" : "http://") + website.host);

  // Set request options
  const options = {
    url: (website.https ? "https://" : "http://") + website.host,
    timeout: config.get("default-timeout"),
    retry: config.get("default-retries"),
  };

  // Setup request
  await got(options)
    .then(async (res) => {
      logger("Status: " + res.statusCode + " - " + res.statusMessage);
      logger("Time: " + res.timings.phases.total + " ms");

      if (website.statusCode != res.statusCode) {
        await notifications
          .notify(
            website.host,
            "✅ " +
              (website.https ? "https://" : "http://") +
              website.host +
              " is up",
            res.statusCode + " - " + res.statusMessage
          )
          .then(() => logger("Notification sent."))
          .catch((error) => {
            logger(error);
          });
      }

      try {
        await website
          .set({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            responseTime: res.timings.phases.total,
            lastChecked: new Date().toISOString(),
          })
          .save();
      } catch (err) {
        logger(err);
      }
    })
    .catch(async (err) => {
      logger("Status: " + err.code + " - " + err.message);
      logger("Time: " + err.timings.phases.total + " ms");

      await notifications
        .notify(
          website.host,
          "🚨 " +
            (website.https ? "https://" : "http://") +
            website.host +
            " is down",
          err.code + " - " + err.message
        )
        .then(() => logger("Notification sent."))
        .catch((error) => {
          logger(error);
        });

      try {
        await website
          .set({
            statusCode: err.code,
            statusMessage: err.message,
            responseTime: err.timings.phases.total,
            lastChecked: new Date().toISOString(),
            lastDown: new Date().toISOString(),
          })
          .save();
      } catch (err) {
        logger(err);
      }
    });

  logger("---------------------------------------------------");
};
