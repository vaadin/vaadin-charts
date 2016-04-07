## Angular 2 Directive

This directory contains the `VaadinCharts` and `DataSeries` directives to be used with
Angular 2 framework.

## Installation

First install the `vaadin-charts` through Bower and add the following
configuration to your `index.html` file.

```javascript
System.config({
  map: {
    'vaadin-charts': 'bower_components/vaadin-charts/directives'
  },
  packages: {
    'vaadin-charts': {
      defaultExtension: 'js',
      main: 'vaadin-charts.js'
    }
  }
});
```

After the configuration is in place, you can import the directive into your
own Angular 2 component as follows.

```javascript
import { VaadinCharts, DataSeries } from 'vaadin-charts';

@Component({
  selector: 'my-component',
  template: '<vaadin-area-chart></vaadin-area-chart>',
  directives: [VaadinCharts, DataSeries]
})
```
