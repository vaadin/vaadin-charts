# &lt;vaadin-chart&gt;

&lt;vaadin-chart&gt; is a [Polymer 2](http://polymer-project.org) element providing an easy way to build the best charts.

<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="vaadin-chart.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-chart>
  ...
</vaadin-chart>
```

## Running demos and tests in browser

1. Fork the `vaadin-chart` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-chart` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-chart/demo
  - http://127.0.0.1:8080/components/vaadin-chart/test


## Running tests from the command line

1. When in the `vaadin-chart` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


