"use strict";

/* * */
/* * */
/* * * * * */
/* STATUS MONITOR */
/* * */

/* * */
/* IMPORTS */
const Website = require("../models/Website");
const config = require("config");
const http = require("http");
const https = require("https");

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
    const timings = {
      // use process.hrtime() as it's not a subject of clock drift
      startAt: process.hrtime(),
      dnsLookupAt: undefined,
      tcpConnectionAt: undefined,
      tlsHandshakeAt: undefined,
      firstByteAt: undefined,
      endAt: undefined,
    };

    // Set request options
    const options = {
      host: website.host,
      timeout: 5000,
    };

    const callback = function (response) {
      response.once("readable", () => {
        timings.firstByteAt = process.hrtime();
      });
      response.on("end", () => {
        timings.endAt = process.hrtime();
      });
      // console.log(response);
      console.log(
        parseInt(process.hrtime(timings.startAt)[1] / 1000000) + "ms"
      );
      console.log("SUCCESSS");
      // console.log(response);
      console.log(timings.startAt);
      console.log(timings.dnsLookupAt);
      console.log(timings.tcpConnectionAt);
      console.log(timings.tlsHandshakeAt);
      console.log(timings.firstByteAt);
      console.log(timings.endAt);
      // saveResult(website, response);
    };

    var request = null;

    if (website.protocol == "http") {
      // If protocol is HTTP
      request = http.request(options, callback);
    } else if (website.protocol == "https") {
      // If protocol is HTTPS
      request = https.request(options, callback);
    } else {
      // If it is an invalid protocol
      return console.log("Invalid protocol: " + website.protocol);
    }

    request
      .on("timeout", function () {
        this.abort();
      })
      .on("error", function (error) {
        console.log("hyuigykb");
        console.log(error);
      })
      .on("socket", (socket) => {
        socket.on("lookup", () => {
          timings.dnsLookupAt = process.hrtime();
        });
        socket.on("connect", () => {
          timings.tcpConnectionAt = process.hrtime();
        });
        socket.on("secureConnect", () => {
          timings.tlsHandshakeAt = process.hrtime();
        });
      })
      .end();

    // Append to the array
    activeMonitors.push(request);
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
  console.log("Website: " + website.title);
  console.log("Protocol: " + website.protocol);
  console.log("Host: " + website.host);
  console.log("Status: " + res.statusCode + " - " + res.statusMessage);
  console.log("Time: " + res.responseTime + " ms");
  console.log("---------------------------------------------------");
};
