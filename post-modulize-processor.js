var fs = require('fs');

fs.readFile('vaadin-chart.js', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var result = data.replace("import 'highcharts/js/es-modules/masters/highstock.src.js';",

      "import { nativeShadow } from '@webcomponents/shadycss/src/style-settings.js';\n" +
      "import ScopingShim from '@webcomponents/shadycss/src/scoping-shim.js';\n" +
      "import Highcharts from 'highcharts/js/es-modules/masters/highstock.src.js';");

  fs.writeFile('vaadin-chart.js', result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
