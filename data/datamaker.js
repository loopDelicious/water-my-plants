var fs = require("file-system");

fs.readFile("dataMaker.csv", "utf8", (err, data) => {
  if (err) throw err;
  let allTextLines = data.split(/\r\n|\n/);

  // parse every line to pull timestamp and moisture value
  let arrayOfArrays = [];
  let formattedArray = [];
  for (let i = 1; i < allTextLines.length; i++) {
    let line = allTextLines[i].split(",");
    arrayOfArrays.push([parseInt(line[1]), line[2]]);
    formattedArray = JSON.stringify(arrayOfArrays).replace(/'/g, '"');
  }
  console.log(formattedArray);
});
