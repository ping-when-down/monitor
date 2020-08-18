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

  const monitorIsOn = config.get("monitor-is-on");
  const restartInterval = config.get("restart-interval");

  console.log();
  console.log("- - - - - - - - - - - - - - - - - -");
  console.log("- Monitor is On: " + monitorIsOn);
  console.log("- Restart Interval: " + restartInterval + " minutes");
  console.log("- - - - - - - - - - - - - - - - - -");
  console.log();

  if (!monitorIsOn) return console.log("Monitor is off.");

  // Connect to the database
  await database.connect();

  // Start monitor module
  await monitor.start();

  setInterval(async () => {
    // Restart monitor module
    await monitor.stop();
    await database.disconnect();
    await database.connect();
    await monitor.start();
  }, restartInterval * 1000 * 60);
})();
