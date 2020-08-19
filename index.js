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
  const restartTimer = config.get("restart-timer");

  console.log();
  console.log("- - - - - - - - - - - - - - - - - -");
  console.log("- Monitor is On: " + monitorIsOn);
  console.log("- Restart Timer: " + restartTimer + " minutes");
  console.log("- - - - - - - - - - - - - - - - - -");
  console.log();

  if (!monitorIsOn) return console.log("Monitor is off.");

  // Connect to the database
  await database.connect();

  // Start monitor module
  await monitor.start();

  setTimeout(async () => {
    console.log();
    console.log("* * * * * * * * * * * * * * * * * * * * * * * * * *");
    console.log("Restart Timer reached.");
    console.log("Shutting down...");

    // Shutdown monitor module
    await monitor.stop();
    await database.disconnect();

    console.log();
    console.log("* * * * * * * * * * * * * * * * * * * * * * * * * *");
    console.log();
  }, restartTimer * 1000 * 60);
})();
