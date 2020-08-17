/* * */
/* * */
/* * * * * */
/* STATUS MONITOR */
/* * */

/* * */
/* IMPORTS */
const Monitor = require("ping-monitor");
const Website = require("../models/Website");

/* * */
/* GLOBAL VARIABLES */
let activeMonitors = [];

exports.stop = async () => {
  console.log();
  console.log("Stopping " + activeMonitors.length + " monitors...");
  for (const am of activeMonitors) am.stop();
  activeMonitors = [];
  console.log("All monitors stopped.");
};

/* * */
/* At program initiation all websites are retrieved from the database */
/* and one ping-monitor instance is set up for each. */
exports.start = async () => {
  console.log();
  console.log("Starting...");

  // Get all websites from the database.
  console.log("Fetching from database...");
  const websites = await Website.find({});

  // If there are no websites to monitor, log and return.
  if (!websites.length) return console.log("No websites to monitor.");
  else console.log("Starting monitor for " + websites.length + " websites.");

  // For each website
  for (const website of websites) {
    // initiate a new instance of ping-monitor.
    const monitor = new Monitor({
      title: website.title,
      website: website.url,
      interval: website.interval / 60,
    });

    // Setup event listeners
    monitor.on("up", async (res) => await saveResult(website, res));
    monitor.on("down", async (res) => await saveResult(website, res));
    // monitor.on("stop", async (res) => await saveResult(website, res));
    monitor.on("error", async (res) => await saveResult(website, res));
    monitor.on("timeout", async (res) => await saveResult(website, res));

    // Append to the array
    activeMonitors.push(monitor);
  }
};

const saveResult = async (website, res) => {
  // Save result to the database
  await website
    .set({
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      responseTime: res.responseTime,
      lastChecked: new Date().toISOString(),
    })
    .save();

  console.log();
  console.log("---------------------------------------------------");
  console.log("Website: " + website.title + " (" + website.url + ")");
  console.log("Status: " + res.statusCode + " - " + res.statusMessage);
  console.log("Time: " + res.responseTime + " ms");
  console.log("Result saved to the database.");
  console.log("---------------------------------------------------");
};
