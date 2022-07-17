var express = require("express");
var app = express();
const fs = require("fs");
require("dotenv").config();
var cors = require("cors");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const shortId = require("shortid");
const bodyParser = require("body-parser");
const uri = process.env.MONGO_URI;
const dns = require("dns");
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
options.all = true;

app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204

app.use(express.static("public"));

app.get("/timestamp", function (req, res) {
  res.sendFile(__dirname + "/views/timestamp.html");
});

app.get("/headerparser", function (req, res) {
  res.sendFile(__dirname + "/views/headerParser.html");
});

//
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
    ipaddress: req.headers["x-forwarded-for"],
    language: req.headers["accept-language"],
    software: req.headers["user-agent"],
  });
});

// URL SHORTENER MICRO SERVICE

app.get("/urlshortener", function (req, res) {
  res.sendFile(__dirname + "/views/urlshort.html");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const Schema = mongoose.Schema;
const urlSchema = new Schema({
  original_url: String,
  short_url: String,
});

const URL = mongoose.model("URL", urlSchema);
let urlExtractor = function (url) {
  let urlSplit;
  if (url.indexOf("https") > -1) {
    urlSplit = url.split("https://");
  } else if (url.indexOf("http") > -1) {
    urlSplit = url.split("http://");
  }
  if (urlSplit === undefined) {
    return urlSplit;
  } else {
    return urlSplit[1].split("/")[0];
  }
};

app.post("/urlshortener/api/shorturl", async function (req, res) {
  const url = req.body.url;
  const urlCode = shortId.generate();

  let testURL = req.body.url;
  testURL = urlExtractor(testURL);

  if (testURL) {
    dns.resolve(testURL, async (err, address, family) => {
      if (err) {
        res.json({ error: "invalid url" });
      } else {
        try {
          // check if its already in the database
          let findOne = await URL.findOne({
            original_url: url,
          });
          if (findOne) {
            res.json({
              original_url: findOne.original_url,
              short_url: findOne.short_url,
            });
          } else {
            // if its not exist yet then create new one and response with the result
            findOne = new URL({
              original_url: url,
              short_url: urlCode,
            });
            await findOne.save();
            res.json({
              original_url: findOne.original_url,
              short_url: findOne.short_url,
            });
          }
        } catch (err) {
          console.error(err);
          res.status(500).json("Server erorr...");
        }
      }
    });
  } else {
    res.json({ error: "invalid URL" });
  }
});

app.get("/urlshortener/api/shorturl/:short_url?", async function (req, res) {
  try {
    const urlParams = await URL.findOne({
      short_url: req.params.short_url,
    });
    if (urlParams) {
      return res.redirect(urlParams.original_url);
    } else {
      return res.status(404).json("No URL found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
});

// File MetaData Microservice

app.get("/filemetadata", function (req, res) {
  res.sendFile(__dirname + "/views/filemetadata.html");
});

var multer = require("multer");
var upload = multer({ dest: "uploads/" });
app.post(
  "/filemetadata/api/fileanalyse",
  upload.single("upfile"),
  async function (req, res) {
    res.json({
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
    });
  }
);

var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + process.env.PORT);
  console.log(`URL : http://localhost:${process.env.PORT}`);
});
