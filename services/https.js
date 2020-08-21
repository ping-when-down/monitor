const https = require("https");

exports.connect = async function () {
  const options = {
    host: "cedricsoares.pt",
    timeout: 5000,
  };

  https
    .request(options, function (response) {
      console.log("yeeey");
      console.log(response);
    })
    .on("timeout", function (error) {
      this.abort();
    })
    .on("error", function (error) {
      console.log("hyuigykb");
      console.log(error);
    })
    .end();

  // try {
  //   https.request(options, callback).end();
  // } catch (err) {
  //   console.log(err);
  //   console.log("ERRRRRRROOOR");
  //   return;
  // }
};
