/* eslint-disable no-console */
const fs = require('fs');

const rules = {
  'vaadin-chart.js': [
    {
      text: `import 'highcharts/js/es-modules/masters/highstock.src.js';`,
      replacement: `import { nativeShadow } from '@webcomponents/shadycss/src/style-settings.js';
import ScopingShim from '@webcomponents/shadycss/src/scoping-shim.js';
import Highcharts from 'highcharts/js/es-modules/masters/highstock.src.js';`
    }
  ],

  'vaadin-chart-default-theme.js': [
    {
      text: `/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/`,
      replacement: ''
    }
  ],

  'test/exporting-test.html': [
    {
      text: /import '..\/vaadin-chart.js';/g,
      replacement: `import Highcharts from 'highcharts/js/es-modules/masters/highstock.src.js';
import '../vaadin-chart.js';`
    }
  ],
  'package.json': [
    {
      text: `"resolutions": {`,
      replacement: `"resolutions": {
        "@webcomponents/webcomponentsjs": "2.0.4",
        "@vaadin/vaadin-element-mixin": "1.1.2",
        "@vaadin/vaadin-usage-statistics": "1.1.0-beta1",
        "@vaadin/vaadin-development-mode-detector": "1.1.0-beta1",`
    }
  ]
};

Object.entries(rules).forEach(rule => {
  fs.readFile(rule[0], 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }

    const result = rule[1].reduce((acc, current) =>
      data.replace(current.text, current.replacement), data);

    fs.writeFile(rule[0], result, 'utf8', err => {
      if (err) {
        return console.log(err);
      }
    });
  });
});
