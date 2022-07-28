"use strict";
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
// const cors = require("cors");

const apiRoutes = require("./stock_api");
// const fccTestingRoutes  = require('./routes/fcctesting.js');
// const runner            = require('./test-runner');

const app = express();

const mongoose = require("mongoose");
// const db = mongoose.connect(process.env.MONGO_URI, {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
// });

const helmet = require("helmet");
const ninetyDaysInSeconds = 90 * 24 * 60 * 60;
/* parent helmet */
app.use(
  helmet({
    hidePoweredBy: {},
    frameguard: {
      //configure
      action: "deny",
    },
    xssFilter: { setOnOldIE: true },

    hsts: {
      maxAge: ninetyDaysInSeconds,
      preload: true,
    },
    dnsPrefetchControl: {
      allow: false,
    },

  })
);

// app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(__dirname + "../views/stock.html");
});

//For FCC testing purposes
// fccTestingRoutes(app);

//Routing for API
apiRoutes(app);


module.exports = app; //for testing
