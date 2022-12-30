var winston = require("winston");
var { Loggly } = require("winston-loggly-bulk");

var fs = require("fs");
var http = require("http");
var https = require("https");
var privateKey = fs.readFileSync(
  "/etc/ssl/private/apache-selfsigned.key",
  "utf8"
);
var certificate = fs.readFileSync(
  "/etc/ssl/certs/apache-selfsigned.crt",
  "utf8"
);
var credentials = { key: privateKey, cert: certificate };

const config = require("config");
const express = require("express");
const app = express();
winston
  .add(
    new Loggly({
      token: "f55ab4ea-ef6a-482c-9b05-b88f4053bed8",
      subdomain: "Organic-Community-Market",
      tags: ["OCM-Logs"],
      json: true,
    })
  )
  .add(new winston.transports.Console());

require("./startup/routes")(app);
//require("./startup/db")();
require("./startup/prod")(app);

if (!config.get("jwtPrivateKey")) {
  // console.error("FATAL ERROR: jwtPrivateKey is not defined");
  winston.log("error", "FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

let port = 8443;
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port);

// //console.log("PORT: ", process.env.PORT);
// app.listen(port, () => {
//   // require("log-timestamp");
//   winston.log("info", `Started listening on PORT=${port}`);
//   console.log(`Listening on ${port}`);
// });

process.on("uncaughtException", (err) => {
  // require("log-timestamp");
  // loggly.log(err, ["error"]);
  winston.log("error", err.stack);
  // console.error(err);
});
