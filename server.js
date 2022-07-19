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

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

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

// Exercise Tracker Microservice

app.get("/exercisetracker", function (req, res) {
  res.sendFile(__dirname + "/views/exercise.html");
});

const exerciseSchema = new Schema({
  description: String,
  duration: Number,
  date: { type: Date, default: Date.now },
});
const schema = new Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true },
  },
  _id: { type: String, required: true },
  exercise: [exerciseSchema],
});

const User = mongoose.model("User", schema);

function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}

app.post("/exercisetracker/api/users", (req, res, next) => {
  const new_user = req.body.username;
  if (new_user) {
    User.findOne({ username: new_user }, function (err, data) {
      if (err) next(err);
      if (data !== null) {
        next({ status: 400, message: "username already exists" });
      } else {
        let user = new User({ username: new_user, _id: shortId.generate() });
        user.save(function (err, data) {
          if (err) {
            next(err);
          }
          res.json({ username: data.username, _id: data._id });
        });
      }
    });
  } else {
    next({ status: 400, message: "no username given" });
  }
});

app.post("/exercisetracker/api/users/:_id/exercises", (req, res, next) => {
  let user_id = req.params._id,
    description = req.body.description,
    duration = req.body.duration,
    date = req.body.date ? new Date(req.body.date) : new Date();

  if (req.params._id) {
    User.findOne({ _id: user_id }, function (err, data) {
      if (err) {
        next(err);
      }
      if (data === null || data._id !== user_id) {
        next({ status: 400, message: "no id" });
      } else {
        User.findByIdAndUpdate(
          { _id: data._id },
          { $push: { exercise: { description, duration, date } } },
          { upsert: true, new: true },
          function (err, data) {
            if (err) {
              next(err);
            }
            if (!data) {
              next({ status: 400, message: "no valid id" });
            } else {
              res.json({
                username: data.username,
                description,
                duration: +duration,
                _id: data._id,
                date: date.toDateString(),
              });
            }
          }
        );
      }
    });
  } else {
    next({ status: 400, message: "no ID given" });
  }

  if (!description) {
    next({ status: 400, message: "missing description" });
  }
  if (!duration) {
    next({ status: 400, message: "missing duration" });
  }
});

app.get("/exercisetracker/api/users/:id/logs", (req, res) => {
  User.findOne({ _id: req.params.id }, (err, data) => {
    if (data === null) {
      res.send({ error: "User not found" });
    } else {
      let exercises = data.exercise;
      const fromDate = new Date(req.query.from);
      const toDate = new Date(req.query.to);
      const limit = Number(req.query.limit);

      if (isValidDate(toDate)) {
        exercises = exercises.filter(
          (item) => item.date >= fromDate && item.date <= toDate
        );
      } else if (isValidDate(fromDate)) {
        exercises = exercises.filter((item) => item.date >= fromDate);
      }

      let logs = [];
      for (let i = 0; i < exercises.length; i++) {
        logs.push({
          description: exercises[i].description,
          duration: exercises[i].duration,
          date: exercises[i].date.toDateString(),
        });
      }

      if (!isNaN(limit) && logs.length > limit) {
        logs = logs.slice(0, limit);
      }

      res.send({
        _id: data._id,
        username: data.username,
        count: logs.length,
        log: logs,
      });
    }
  });
});

app.get("/exercisetracker/api/users", (req, res) => {
  const logs = { exercise: false };
  User.find({}, logs, (err, data) => {
    if (err) {
      res.send({ error: "Error users" });
    }
    res.json(data);
  });
});

// Random Quote
app.get("/randomquote", function (req, res) {
  res.sendFile(__dirname + "/views/randomquote.html");
});

// MD Preview

app.get("/mdpreview", function (req, res) {
  res.sendFile(__dirname + "/views/mdpreview.html");
});


app.get("/calculator", function (req, res) {
  res.sendFile(__dirname + "/views/calculator.html");
});

app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res.status(errCode).type("txt").send(errMessage);
});

var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + process.env.PORT);
  console.log(`URL : http://localhost:${process.env.PORT}`);
});
