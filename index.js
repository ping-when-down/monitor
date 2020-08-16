/* * */
/* * */
/* * * * * */
/* PING WHEN DOWN */
/* * */

/* * */
/* IMPORTS */
const database = require("./services/database");
const config = require("config");
const monitor = require("./app/monitor");

/* * *
 * MONITOR
 */
(async () => {
  console.log();
  console.log("* * * * * * * * * * * * * * * * * * * * * * * * * *");
  console.log("* * * * * * PING WHEN DOWN —> MONITOR * * * * * * *");
  console.log("* * * * * * * * * * * * * * * * * * * * * * * * * *");

  console.log();
  console.log("Starting module...");

  // Set module configurations
  const monitorIsOn = config.get("monitor-is-on");
  const restartInterval = config.get("restart-interval") * 1000 * 60; // seconds to minutes

  if (!monitorIsOn) return console.log("Monitor is off.");

  // Connect to the database
  await database.connect();

  // Start monitor module
  await monitor.start();

  setInterval(async () => {
    // Restart monitor module
    await monitor.stop();
    await monitor.start();
  }, restartInterval);
})();
