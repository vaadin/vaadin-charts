var fs = require('fs');

fs.readFile('vaadin-chart.js', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var result = data.replace("import 'highcharts/js/es-modules/masters/highstock.src.js';",
      "import { Highcharts } from 'highcharts/js/es-modules/masters/highstock.src.js';");

  fs.writeFile('vaadin-chart.js', result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
