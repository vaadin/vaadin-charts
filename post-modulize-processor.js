var fs = require('fs');

fs.readFile('vaadin-chart.js', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  data = data.replace("import 'highcharts/js/es-modules/masters/highstock.src.js';",

      "import { nativeShadow } from '@webcomponents/shadycss/src/style-settings.js';\n" +
      "import ScopingShim from '@webcomponents/shadycss/src/scoping-shim.js';\n" +
      "import Highcharts from 'highcharts/js/es-modules/masters/highstock.src.js';");

  const result = data.replace("/*\n" +
      "  FIXME(polymer-modulizer): the above comments were extracted\n" +
      "  from HTML and may be out of place here. Review them and\n" +
      "  then delete this comment!\n" +
      "*/", "");

  fs.writeFile('vaadin-chart.js', result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
