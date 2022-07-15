var express = require("express");
var app = express();
require("dotenv").config();

var cors = require("cors");
app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api", function (req, res) {
  res.json({ unix: Date.now(), utc: Date() });
});

app.get("/api/:date", function (req, res) {
  let dateString = req.params.date;
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

var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + process.env.PORT);
  console.log(`URL : http://localhost:${process.env.PORT}`);
});
