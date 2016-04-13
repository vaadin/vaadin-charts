## Angular 2 Directive

This directory contains the `VaadinCharts` and `DataSeries` directives to be used with
Angular 2 framework.

## Installation

1) First install the `vaadin-charts` through Bower.

```bash
bower install --save vaadin-charts
```

2) Import Web Component polyfills in your `index.html` file's `<head>`.

```html
<script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>
```

3) Add the following configuration to your `index.html` file.

```javascript
System.config({
  map: {
    'vaadin-charts': 'bower_components/vaadin-charts/directives'
  },
  packages: {
    app: {
      format: 'register',
      defaultExtension: 'js'
    },
    'vaadin-charts': {
      defaultExtension: 'js',
      main: 'vaadin-charts.js'
    }
  }
});
```

After the configuration is in place, you can import the directives into your
own Angular 2 component as follows. (Note: typescript may show error: Cannot find module 'vaadin-charts')

```javascript
import { VaadinCharts, DataSeries } from 'vaadin-charts';

@Component({
  selector: 'my-component',
  template: '<vaadin-area-chart></vaadin-area-chart>',
  directives: [VaadinCharts, DataSeries]
})
```
