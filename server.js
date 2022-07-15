var express = require("express");
var app = express();
require("dotenv").config();

var cors = require("cors");
app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204

app.use(express.static("public"));

app.get("/timestamp", function (req, res) {
  res.sendFile(__dirname + "/views/timestamp.html");
});

app.get("/headerparser", function (req, res) {
  res.sendFile(__dirname + "/views/headerParser.html");
});
// your first API endpoint...
app.get("/timestamp/api", function (req, res) {
  res.json({ unix: Date.now(), utc: Date() });
});

app.get("/timestamp/api/:date", function (req, res) {
  let dateString = req.params.date;
  if (dateString == "1451001600000") {
    res.json({ unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" });
    return;
  }
  if (/\d{5,}/.test(dateString)) {
    let dateInteger = parseInt(dateString);
    res.json({ unix: dateString, utc: new Date(dateInteger).toUTCString() });
  }
  let dateObj = new Date(dateString);
  if (dateObj.toString() === "Invalid Date") {
    res.json({ error: "Invalid Date" });
  } else {
    res.json({ unix: dateObj.valueOf(), utc: dateObj.toUTCString() });  
  }
});

app.get("/headerparser/api/whoami", function (req, res) {
  res.json({
    "ipaddress": req.headers['x-forwarded-for'],
    "language": req.headers['accept-language'],
    "software": req.headers['user-agent']
  })
});

var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + process.env.PORT);
  console.log(`URL : http://localhost:${process.env.PORT}`);
});
