/* * */
/* * */
/* * * * * */
/* STATUS MONITOR */
/* * */

/* * */
/* IMPORTS */
const mongoose = require("mongoose");
const { Website } = require("../models/Website");
const Monitor = require("ping-monitor");

/* * */
/* At program initiation all websites are retrieved from the database */
module.exports = async () => {
  // Get all transactions from the database
  let websites = await Website.find({});
  console.log(websites);

  // If there are transactions to process
  if (websites.length) {
    for (const website of websites) {
      const monitor = new Monitor({
        title: website.title,
        website: website.url,
        interval: website.interval, // minutes
      });

      monitor.on("up", function (res, state) {
        console.log("Yay!! " + res.website + " is up.");
      });

      monitor.on("down", function (res) {
        console.log(
          "Oh Snap!! " + res.website + " is down! " + res.statusMessage
        );
      });

      monitor.on("stop", function (website) {
        console.log(website + " monitor has stopped.");
      });

      monitor.on("error", function (error) {
        console.log(error);
      });
    }

    // If response is empty, return no new transactions to process
  } else console.log("No websites to monitor.");
};
