var http = require("http");
var path = require("path");
var express = require("express");
var strftime = require("strftime");
var router = express();
var server = http.createServer(router);

require("dotenv").config();

router.use(express.static("public"));

router.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// route on GET with a parameter we call :date
router.get("/api/:date", function (req, res) {
  // creating a date object
  var date = new Date();
  // if the given parameter is a number (timestamp)
  if (/^\d*$/.test(req.params.date)) {
    date.setTime(req.params.date);
  }
  // else we just create a new date parsing the string given
  else {
    date = new Date(req.params.date);
  }

  // giving headers for JSON
  res.set({ "Content-Type": "application/json" });
  // if the date is invalid
  if (!date.getTime())
    res.send(JSON.stringify({ error: "Invalid date given" }));
  // else, we send the object with two members (unix and natural)
  else
    res.send(
      JSON.stringify({
        unix: date.getTime(),
        utc: strftime("%B %d, %Y", date),
      })
    );
});

// listening to port and processing
server.listen(
  process.env.PORT || 3000,
  process.env.IP || "0.0.0.0",
  function () {
    var addr = server.address();
    console.log(
      "Timestamp microservice listening at",
      addr.address + ":" + addr.port
    );
  }
);
