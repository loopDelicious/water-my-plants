const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
require("dotenv").config();
const redis = require("@metamodules/redis")();

const app = express();
const port = 4000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// get moisture values
app.get("/water", (req, res) => {
  // if additional parameters sent, limit the scope of the query
  if (req.body.records && isNaN(req.body.records)) {
    res.send(`${req.body.records} is not a number`);
  } else {
    let records = req.body.records ? req.body.records : -1;
    // https://redis.io/commands/zrangebyscore
    let args = [
      "timeseries",
      "-inf",
      "+inf",
      "WITHSCORES",
      "LIMIT",
      0,
      records
    ];
    redis.ZRANGEBYSCORE(args, function(err, data) {
      if (err) throw err;
      // format the data
      let timeseries = [];
      for (let i = 0; i < data.length; i += 2) {
        timeseries.push([+new Date(data[i]), data[i + 1]]);
      }
      res.send(timeseries);
    });
  }
});

// add a new nmoisture value
app.post("/water", (req, res) => {
  // https://redis.io/commands/zadd
  let timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
  let moistureValue = req.body.moisture;
  let args = ["timeseries", moistureValue, timestamp];
  if (isNaN(moistureValue)) {
    res.send(`${moistureValue} is not a number`);
  } else {
    redis.zadd(args, function(err, response) {
      if (err) throw err;
      res.send(`${moistureValue} added`);
    });
  }
});

app.delete("/water", (req, res) => {
  let key = req.body.key;
  redis.del(key, function(err, response) {
    if (response == 1) {
      console.log("Deleted Successfully!");
      res.send(`${key} deleted`);
    } else {
      console.log("Cannot delete");
    }
  });
});

app.listen(port, () =>
  console.log(`Example backend API listening on port ${port}!`)
);
