const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const redis = require("@metamodules/redis")();

const app = express();
const port = 4000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/water", (req, res) => {
  // https://redis.io/commands/zrangebyscore
  let args = ["series", "-inf", "+inf", "WITHSCORES"];
  redis.ZRANGEBYSCORE(args, function(err, measurements) {
    if (err) throw err;

    res.send(measurements);
  });
});

app.post("/water", (req, res) => {
  // https://redis.io/commands/zadd
  let timestamp = +new Date();
  let moistureValue = req.body.moisture;
  let args = ["series", moistureValue, timestamp];
  redis.zadd(args, function(err, response) {
    if (err) throw err;
    res.send(`${moistureValue} added`);
  });
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
