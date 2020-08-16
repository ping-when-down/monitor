/* * */
/* * */
/* * * * * */
/* STATUS MONITOR */
/* * */

/* * */
/* IMPORTS */
const Monitor = require("ping-monitor");
const { Website } = require("../models/Website");

/* * */
/* At program initiation all websites are retrieved from the database */
/* and one ping-monitor instance is set up for each. */
module.exports = async () => {
  // Get all websites from the database
  let websites = await Website.find({});

  // If there are websites to monitor
  if (websites.length) {
    // then, for each
    for (const website of websites) {
      // initiate a new instance of ping-monitor
      const monitor = new Monitor({
        title: website.title,
        website: website.url,
        interval: website.interval / 60,
      });

      // IF: Website is up
      monitor.on("up", function (res, state) {
        console.log("Yay!! " + res.website + " is up.");
        console.log(res);
        website
          .set({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            responseTime: res.responseTime,
          })
          .save();
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
