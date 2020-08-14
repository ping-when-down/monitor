/* * */
/* * */
/* * * * * */
/* PING WHEN DOWN */
/* * */

/* Connect to the database */
require("./services/database")();

/* Start monitor */
require("./app/monitor")();
