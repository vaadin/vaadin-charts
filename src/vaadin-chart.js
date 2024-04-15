/**
@license
Vaadin Charts
Copyright (C) 2015 Vaadin Ltd
This program is available under Commercial Vaadin Add-On License 3.0 (CVALv3).
See the file LICENSE.md distributed with this software for more information about licensing.
See <a href="https://vaadin.com/license/cval-3">the website</a> for the complete license.
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import '@vaadin/vaadin-license-checker/vaadin-license-checker.js';
import { ChartSeriesElement } from './vaadin-chart-series.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { nativeShadow } from '@webcomponents/shadycss/src/style-settings.js';

import ScopingShim from '@webcomponents/shadycss/src/scoping-shim.js';

import Highcharts from 'highcharts/js/es-modules/masters/highstock.src.js';
import 'highcharts/js/es-modules/masters/modules/accessibility.src.js';
import 'highcharts/js/es-modules/masters/highcharts-more.src.js';
import 'highcharts/js/es-modules/masters/highcharts-3d.src.js';
import 'highcharts/js/es-modules/masters/modules/data.src.js';
import 'highcharts/js/es-modules/masters/modules/drilldown.src.js';
import 'highcharts/js/es-modules/masters/modules/exporting.src.js';
import 'highcharts/js/es-modules/masters/modules/funnel.src.js';
import 'highcharts/js/es-modules/masters/modules/heatmap.src.js';
import 'highcharts/js/es-modules/masters/modules/solid-gauge.src.js';
import 'highcharts/js/es-modules/masters/modules/treemap.src.js';
import 'highcharts/js/es-modules/masters/modules/no-data-to-display.src.js';
import 'dompurify/dist/purify.min.js';
window.sanitizeHighchartsAPI = (Highcharts, DOMPurify) => {
  var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
  if (isIE11) {
    DOMPurify.setConfig({
      FORCE_BODY: true,
    });
  }
  // This function will recursively sanitize all strings in the options object
  // Source: https://jsfiddle.net/highcharts/zd3wcm5L/
  function stripHTMLRecurse(obj) {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return DOMPurify.sanitize(obj);
    }

    if (typeof obj !== 'object') {
      return obj;
    }

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'string') {
        obj[key] = DOMPurify.sanitize(obj[key]);
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item, i) => {
          obj[key][i] = stripHTMLRecurse(item);
        });
      } else if (typeof obj[key] === 'object') {
        obj[key] = stripHTMLRecurse(obj[key]);
      }
    });
    return obj;
  }

  const update = Highcharts.Chart.prototype.update;
  Highcharts.Chart.prototype.update = function (
    options,
    redraw,
    oneToOne,
    animation
  ) {
    options = stripHTMLRecurse(options);
    return update.call(this, options, redraw, oneToOne, animation);
  };

  const newChart = Highcharts.chart;
  Highcharts.chart = function (renderTo, options, callback) {
    options = stripHTMLRecurse(options);
    return newChart.call(this, renderTo, options, callback);
  };

  const newHighstock = Highcharts.stockChart;
  Highcharts.stockChart = function (renderTo, options, callback) {
    options = stripHTMLRecurse(options);
    return newHighstock.call(this, renderTo, options, callback);
  };

  const axisUpdate = Highcharts.Axis.prototype.update;
  Highcharts.Axis.prototype.update = function (options, redraw) {
    options = stripHTMLRecurse(options);
    return axisUpdate.call(this, options, redraw);
  };

  const seriesUpdate = Highcharts.Series.prototype.update;
  Highcharts.Series.prototype.update = function (options, redraw) {
    options = stripHTMLRecurse(options);
    return seriesUpdate.call(this, options, redraw);
  };

  const legendUpdate = Highcharts.Legend.prototype.update;
  Highcharts.Legend.prototype.update = function (options, redraw) {
    options = stripHTMLRecurse(options);
    return legendUpdate.call(this, options, redraw);
  };

  const addCredits = Highcharts.Chart.prototype.addCredits;
  Highcharts.Chart.prototype.addCredits = function (credits) {
    credits = stripHTMLRecurse(credits);
    return addCredits.call(this, credits);
  };

  const setTitle = Highcharts.Chart.prototype.setTitle;
  Highcharts.Chart.prototype.setTitle = function (
    titleOptions,
    subtitleOptions,
    redraw
  ) {
    titleOptions = stripHTMLRecurse(titleOptions);
    subtitleOptions = stripHTMLRecurse(subtitleOptions);
    return setTitle.call(this, titleOptions, subtitleOptions, redraw);
  };

  const tooltipUpdate = Highcharts.Tooltip.prototype.update;
  Highcharts.Tooltip.prototype.update = function (options) {
    options = stripHTMLRecurse(options);
    return tooltipUpdate.call(this, options);
  };
};

/** @private */
// eslint-disable-next-line no-unused-vars
export const ChartDeepMerger = (() =>
  class {
    static __isObject(item) {
      return item && typeof item === 'object' && !Array.isArray(item);
    }

    static __deepMerge(target, source) {
      if (this.__isObject(source) && this.__isObject(target)) {
        for (const key in source) {
          if (this.__isObject(source[key])) {
            if (!target[key]) {
              Object.assign(target, { [key]: {} });
            }

            this.__deepMerge(target[key], source[key]);
          } else {
            Object.assign(target, { [key]: source[key] });
          }
        }
      }

      return target;
    }
  })();

if (Highcharts) {
  ['exportChart', 'exportChartLocal', 'getSVG'].forEach((methodName) => {
    Highcharts.wrap(Highcharts.Chart.prototype, methodName, function (proceed) {
      Highcharts.fireEvent(this, 'beforeExport');
      const result = proceed.apply(
        this,
        Array.prototype.slice.call(arguments, 1)
      );
      Highcharts.fireEvent(this, 'afterExport');
      return result;
    });
  });
}
if (Highcharts) {
  Highcharts.wrap(
    Highcharts.seriesTypes.column.prototype,
    'plotGroup',
    function (proceed, prop, name, visibility, zIndex, parent) {
      if (this.chart.is3d() && this[prop]) {
        delete this[prop];
      }
      return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
  );
}
if (!PolymerElement) {
  console.warn(
    `Unexpected Polymer version ${Polymer.version} is used, expected v2.0.0 or later.`
  );
}

// eslint-disable-next-line no-undef
sanitizeHighchartsAPI(Highcharts, DOMPurify);

/**
 * `<vaadin-chart>` is a Web Component for creating high quality charts.
 *
 * ### Quick Start
 *
 * #### Polymer 2 App
 *
 * 1. Create a Polymer application using [Polymer CLI](https://www.polymer-project.org/2.0/docs/tools/polymer-cli)
 * ```
 * mkdir my-app
 * cd my-app
 * polymer init
 * select `polymer-2-application`
 * ```
 * 1. Install Vaadin Charts
 * ```
 * bower install --save vaadin-charts
 * ```
 * 1. Import `<vaadin-chart>` to your app
 * Edit the file `src/my-app/my-app.html` and add the following snipped before the `<dom-module>` tag
 * ```html
 * <link rel="import" href="../../bower_components/vaadin-charts/vaadin-chart.html">
 * ```
 * 1. Add your first `<vaadin-chart>`
 * Also in `my-app.html` add the following snippet before the `</template>` closing tag
 * ```html
 * <vaadin-chart></vaadin-chart>
 * ```
 * 1. Run your app with:
 * ```
 * polymer serve --open
 * ```
 *
 * #### Polymer 3 App
 *
 * * 1. Create a Polymer application using [Polymer CLI](https://www.polymer-project.org/3.0/docs/tools/polymer-cli)
 * ```
 * mkdir my-app
 * cd my-app
 * polymer init
 * select `polymer-3-application`
 * ```
 * 1. Install Vaadin Charts
 * ```
 * npm i @vaadin/vaadin-charts --save
 * ```
 * 1. Import `<vaadin-chart>` to your app
 * Edit the file `src/my-app/my-app.js` and add the following snipped on the top, after the first `import` declaration
 * ```js
 * import '@vaadin/vaadin-charts';
 * ```
 * 1. Add your first `<vaadin-chart>`
 * Also in `my-app.js`, at the template getter, add the following snippet after the `</h2>` closing tag
 * ```html
 * <vaadin-chart></vaadin-chart>
 * ```
 * 1. Run your app with:
 * ```
 * polymer serve --npm --open
 * ```
 *
 * Congratulations! You have your first Vaadin Chart setup.
 *
 * ### Basic use
 *
 * Now that we covered the basic steps to create an empty chart, let us show how you can configure it.
 *
 * There are two ways of configuring your `<vaadin-chart>` element: **HTML API**, **JS API** and **JSON API**.
 * Note that you can make use of all APIs in your element.
 *
 * #### Configuring your chart using HTML API
 *
 * `vaadin-chart` has a set of attributes to make it easier for you to customize your chart.
 * Using as a base the project created with in Quick Start:
 *
 * ```html
 *  <vaadin-chart title="The chart title" subtitle="The chart subtitle">
 *    <vaadin-chart-series
 *          type="column"
 *          title="The series title"
 *          values="[10,20,30]">
 *    </vaadin-chart-series>
 *  </vaadin-chart>
 * ```
 *
 * > Note that while you can set type for each series individually, for some types, such as `'bar'`, `'gauge'` and `'solidgauge'`, you
 * > have to set it as the default series type on `<vaadin-chart>` in order to work properly.
 *
 * #### Configuring your chart using JS API
 *
 * Using as a base the project created with in Quick Start
 *
 * Do the following changes in `my-app.html`
 *
 * 1. Set and id for the `<vaadin-chart>` in the template
 * ```html
 *     <vaadin-chart id="mychart"></vaadin-chart>
 * ```
 * 1. Add a function that uses `configuration` property (JS Api) to set chart title, categories and data
 * ```js
 * initChartWithJSApi() {
 *     Polymer.RenderStatus.beforeNextRender(this, () => {
 *        const configuration = this.$.mychart.configuration;
 *        configuration.setTitle({ text: 'The chart title' });
 *        // By default there is one x axis, it is referenced by configuration.xAxis[0].
 *        configuration.xAxis[0].setCategories(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
 *        configuration.addSeries({
 *            type: 'column',
 *            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
 *        });
 *     });
 * }
 * ```
 * 1. Call that function from connectedCallback (when the element is added to a document)
 * ```js
 * connectedCallback() {
 *     super.connectedCallback();
 *     this.initChartWithJSApi();
 * }
 * ```
 * 1. And finally run your app with:
 * ```
 * polymer serve --open
 * ```
 *
 *
 * #### Configuring your chart using JS JSON API
 *
 * JS JSON API is a simple alternative to the JS API.
 *
 * Using as a base the project created with in Quick Start
 *
 * Do the following changes in `my-app.html`
 *
 * 1. Set and id for the `<vaadin-chart>` in the template
 * ```html
 *     <vaadin-chart id="mychart"></vaadin-chart>
 * ```
 * 1. Add a function that uses `update` method (JS JSON Api) to set chart title, categories and data
 * ```js
 * initChartWithJSJSONApi() {
 *     this.$.mychart.update({
 *       title: {
 *         text: 'The chart title'
 *       },
 *       subtitle: {
 *         text: 'Subtitle'
 *       },
 *       xAxis: {
 *         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
 *       },
 *       series: [{
 *         type: 'column',
 *         data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
 *       }]
 *     });
 * }
 * ```
 * 1. Call that function from connectedCallback (when the element is added to a document)
 * ```js
 * connectedCallback() {
 *     super.connectedCallback();
 *     this.initChartWithJSJSONApi();
 * }
 * ```
 * 1. And finally run your app with:
 * ```
 * polymer serve --open
 * ```
 *
 * It should be noted that chart style customization cannot be done via the JS or JSON API.
 * Styling properties in the JSON configuration will be ignored. The following section discusses chart styling.
 *
 *
 * ### CSS Styling
 * Chart appearance is primarily controlled by CSS style rules.
 * A comprehensive list of the supported style classes can be found at
 * https://www.highcharts.com/docs/chart-design-and-style/style-by-css
 *
 *
 * ### Steps for styling a chart
 *
 * 1. Create a theme file (for example `shared-styles.html`). The theme's dom-module must declare `theme-for=vaadin-chart`.
 * 2. Import `vaadin-chart-default-theme.html` and declare `include="vaadin-chart-default-theme"`
 * on the theme module's style tag to customize Chart's default theme. If there are multiple theme
 * modules *only one* of them should declare this `include`.
 * 3. Specify the desired CSS rules in the theme file.
 * 4. If multiple charts are present, each one can be specifically targeted using the host selector e.g `:host(.my-chart-class)`.
 * 5. Import the theme file.
 *
 *
 * ### Example: Two Charts with a Red Title but only one with a Blue Subtitle
 *
 * ```html
 * <link rel="import" href="shared-styles.html">
 * ...
 * <vaadin-chart title="Red Title" subtitle="Not Styled">
 *   <vaadin-chart-series values="[19,12,9,24,5]"></vaadin-chart-series>
 * </vaadin-chart>
 *
 * <vaadin-chart class="blue-subtitle" title="Red Title" subtitle="Blue Subtitle">
 *   <vaadin-chart-series values="[19,12,9,24,5]"></vaadin-chart-series>
 * </vaadin-chart>
 * ```
 *
 * shared-styles.html
 *
 * ```html
 * <link rel="import" href="../bower_components/vaadin-charts/theme/vaadin-chart-default-theme.html">
 *
 * <dom-module id="css-style-example" theme-for="vaadin-chart">
 *    <template>
 *      <style include="vaadin-chart-default-theme">
 *        .highcharts-title {
 *          fill: red;
 *          font-size: xx-large;
 *        }
 *
 *        :host(.blue-subtitle) .highcharts-subtitle {
 *          fill: blue;
 *        }
 *      </style>
 *    </template>
 * </dom-module>
 * ```
 *
 * ### RTL support
 *
 * `vaadin-charts` as well as [Highcharts](https://www.highcharts.com/) by itself are not adjusting the layout
 * based on the `dir` attribute. In order to make `vaadin-charts` display RTL content properly additional
 * JSON configuration should be used.
 * Each chart should be updated based on the specific needs, but general recommendations are:
 *
 *  1. Set `reversed` to true for xAxis (https://api.highcharts.com/highcharts/xAxis.reversed).
 *  2. Set `useHTML` to true for text elements, i.e. `tooltip` (https://api.highcharts.com/highcharts/tooltip.useHTML).
 *  3. Set `rtl` to true for `legend` (https://api.highcharts.com/highcharts/legend.rtl).
 *
 * Using as a base the project created with in Quick Start and an `additionalOptions` in order to make RTL adjustments:
 *
 * ```html
 *  <vaadin-chart title="۱- عنوان نمودار" subtitle="۲- عنوان فرعی نمودار"
 *    additional-options='{"title": {"useHTML": true}, "tooltip": {"useHTML": true}, "subtitle": {"useHTML": true},
 *    "legend": {"rtl": true}, "yAxis": [{"id": "۴- مقادیر", "title": {"text": "۴- مقادیر", "useHTML": true}}],
 *    "xAxis": {"reversed": true}}'>
 *    <vaadin-chart-series
 *          type= "column"
 *          title="۳- عنوان ردیف"
 *          unit="۴- مقادیر"
 *          values="[10,20,30]">
 *    </vaadin-chart-series>
 *  </vaadin-chart>
 * ```
 *
 * ### Setting colors
 *
 * Although charts can be styled as described above, there is a simpler way for setting colors.
 * Colors can be set using CSS custom properties `--vaadin-charts-color-{n}` (where `n` goes from `0 - 9`).
 *
 * For example `--vaadin-charts-color-0` sets the color of the first series on a chart.
 *
 * ### Validating your License
 * After one day using Vaadin Charts in a development environment you will see a pop-up that asks you
 * to validate your license by signing in to vaadin.com.
 *
 * @extends PolymerElement
 * @demo demo/index.html
 */
class ChartElement extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          width: 100%;
          overflow: hidden;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>
      <div id="chart"></div>
      <slot id="slot"></slot>
    `;
  }

  static get is() {
    return 'vaadin-chart';
  }

  static get version() {
    return '6.3.4';
  }

  static get cvdlName() {
    return 'vaadin-chart';
  }

  static get properties() {
    return {
      /**
       * Configuration object that exposes the JS Api to configure the chart.
       *
       * Most important methods are:
       * - `addSeries (Object options, [Boolean redraw], [Mixed animation])`
       * - `addAxis (Object options, [Boolean isX], [Boolean redraw], [Mixed animation])`
       * - `setTitle (Object title, object subtitle, Boolean redraw)`
       *
       * Most important properties are:
       * - `configuration.series`: An array of the chart's series. Detailed API for Series object is
       *     available in [API Site](http://api.highcharts.com/class-reference/Highcharts.Series)
       * - `configuration.xAxis`: An array of the chart's x axes. Detailed API for Axis object is
       *     available in [API Site](http://api.highcharts.com/class-reference/Highcharts.Axis)
       * - `configuration.yAxis`: An array of the chart's y axes. Detailed API for Axis object is
       *     available in [API Site](http://api.highcharts.com/class-reference/Highcharts.Axis)
       * - `configuration.title`: The chart title.
       *
       * For detailed documentation of available API check the [API site](http://api.highcharts.com/class-reference/classes.list)
       * @readonly
       * @public
       * @type {Object}
       */
      configuration: Object,

      /**
       * If categories are present names are used instead of numbers for the category axis.
       * The format of categories can be an `Array` with a list of categories, such as `['2010', '2011', '2012']`
       * or a mapping `Object`, like `{0:'1',9:'Target (10)', 15: 'Max'}`.
       */
      categories: {
        type: Object,
        reflectToAttribute: true,
        observer: '__updateCategories',
      },

      /**
       * Category-axis maximum value. Defaults to `undefined`.
       */
      categoryMax: {
        type: Number,
        observer: '__updateCategoryMax',
        reflectToAttribute: true,
      },

      /**
       * Category-axis minimum value. Defaults to `undefined`.
       */
      categoryMin: {
        type: Number,
        observer: '__updateCategoryMin',
        reflectToAttribute: true,
      },

      /**
       * The position of the category axis. Acceptable values are `left`, `right`, `top` and `bottom`
       * except for bar charts which only accept `left` and `right`.
       * With the default value, charts appear as though they have `category-position="bottom"`
       * except for bar charts that appear as though they have `category-position="left"`.
       *
       * Defaults to `undefined`
       */
      categoryPosition: {
        type: String,
        observer: '__updateCategoryPosition',
        reflectToAttribute: true,
      },

      /**
       * Specifies whether to hide legend or show.
       * Legend configuration can be set up via additionalOptions property
       */
      noLegend: {
        type: Boolean,
        observer: '__hideLegend',
        reflectToAttribute: true,
      },

      /**
       * Specifies how series are stacked on top of each other.
       * Possible values are null, "normal" or "percent".
       * If "stack" property is not defined on the vaadin-chart-series elements, then series will be put into
       * the default stack.
       */
      stacking: {
        type: String,
        observer: '__stackingObserver',
        reflectToAttribute: true,
      },

      /**
       * Specifies whether the chart is a normal chart or a timeline chart.
       */
      timeline: {
        type: Boolean,
        reflectToAttribute: true,
      },

      /**
       * Represents the title of the chart.
       */
      title: {
        type: String,
        observer: '__updateTitle',
        reflectToAttribute: true,
      },

      /**
       * Whether or not to show tooltip when hovering data points.
       */
      tooltip: {
        type: Boolean,
        observer: '__tooltipObserver',
        reflectToAttribute: true,
      },

      /**
       * Sets the default series type of the chart.
       * Note that `'bar'`, `'gauge'` and `'solidgauge'` should be set as default series type.
       */
      type: {
        type: String,
        observer: '__updateType',
        reflectToAttribute: true,
      },

      /**
       * Represents the subtitle of the chart.
       */
      subtitle: {
        type: String,
        observer: '__updateSubtitle',
        reflectToAttribute: true,
      },

      /**
       * Specifies whether to show chart in 3 or in 2 dimensions.
       * Some display angles are added by default to the "chart.options3d" (`{alpha: 15, beta: 15, depth: 50}`).
       * 3D display options can be modified via `additionalOptions`.
       * The thickness of a Pie chart can be set on `additionalOptions` through `plotOptions.pie.depth`.
       * 3D is supported by Bar, Column, Pie and Scatter3D charts.
       * More info available at [Highcharts](https://www.highcharts.com/docs/chart-concepts/3d-charts).
       */
      chart3d: {
        type: Boolean,
        observer: '__chart3dObserver',
        reflectToAttribute: true,
      },

      /**
       * Specifies the message displayed on a chart without displayable data.
       */
      emptyText: {
        type: String,
        value: ' ',
        observer: '__emptyTextObserver',
        reflectToAttribute: true,
      },

      /**
       * Represents additional JSON configuration.
       */
      additionalOptions: {
        type: Object,
        reflectToAttribute: true,
      },

      /**
       * When present, cartesian charts like line, spline, area and column are transformed
       * into the polar coordinate system.
       */
      polar: {
        type: Boolean,
        reflectToAttribute: true,
        observer: '__polarObserver',
      },
    };
  }

  static get observers() {
    return ['__updateAdditionalOptions(additionalOptions.*)'];
  }

  /**
   * @protected
   */
  static _finalizeClass() {
    super._finalizeClass();

    const devModeCallback = window.Vaadin.developmentModeCallback;
    const licenseChecker =
      devModeCallback && devModeCallback['vaadin-license-checker'];
    if (typeof licenseChecker === 'function') {
      licenseChecker(ChartElement);
    }
  }

  constructor() {
    super();

    /**
     * List of properties that will always be copied from the chart element to the container div
     **/
    this._copyStyleProperties = ['flex', '-webkit-flex', '-ms-flex'];

    this._baseConfig = {
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      title: {
        text: null,
      },
      series: [],
      xAxis: {},
      yAxis: {
        axisGenerated: true,
      },
    };

    this._baseChart3d = {
      enabled: true,
      alpha: 15,
      beta: 15,
      depth: 50,
    };

    this.__mutationCallback = this.__mutationCallback.bind(this);
  }

  /** @private */
  connectedCallback() {
    super.connectedCallback();
    this.__updateStyles();
    beforeNextRender(this, () => {
      // Detect if the chart had already been initialized. This might happen in
      // environments where the chart is lazily attached (e.g Grid).
      if (this.configuration) {
        this.__reflow();
        return;
      }

      const options = Object.assign(
        {},
        this.options,
        this._jsonConfigurationBuffer
      );
      this._jsonConfigurationBuffer = null;
      this.__initChart(options);
      this.__addChildObserver();
      const config = { attributes: true, characterData: true };
      this.__mutationObserver = new MutationObserver(this.__mutationCallback);
      this.__mutationObserver.observe(this, config);
    });
  }

  get options() {
    const options = Object.assign({}, this._baseConfig);
    ChartDeepMerger.__deepMerge(options, this.additionalOptions);

    if (this.type) {
      options.chart = options.chart || {};
      options.chart.type = this.type;
    }

    if (this.polar) {
      options.chart = options.chart || {};
      options.chart.polar = true;
    }

    if (this.title) {
      options.title = {
        text: this.title,
      };
    }

    if (!options.tooltip) {
      // Workaround for highcharts#7398 to make updating tooltip works
      options.tooltip = {};
      if (!this.tooltip) {
        options.tooltip.enabled = false;
      }
    }

    if (this.subtitle) {
      options.subtitle = {
        text: this.subtitle,
      };
    }

    if (this.categories) {
      options.xAxis = options.xAxis || {};
      if (Array.isArray(options.xAxis)) {
        // Set categories on first x axis
        options.xAxis[0].categories = this.categories;
      } else {
        options.xAxis.categories = this.categories;
      }
    }

    if (isFinite(this.categoryMin)) {
      options.xAxis = options.xAxis || {};
      if (Array.isArray(options.xAxis)) {
        // Set category-min on first x axis
        options.xAxis[0].min = this.categoryMin;
      } else {
        options.xAxis.min = this.categoryMin;
      }
    }

    if (isFinite(this.categoryMax)) {
      options.xAxis = options.xAxis || {};
      if (Array.isArray(options.xAxis)) {
        // Set category-max on first x axis
        options.xAxis[0].max = this.categoryMax;
      } else {
        options.xAxis.max = this.categoryMax;
      }
    }

    if (this.noLegend) {
      options.legend = {
        enabled: false,
      };
    }

    if (this.emptyText) {
      options.lang = options.lang || {};
      options.lang.noData = this.emptyText;
    }

    if (this.categoryPosition) {
      options.chart = options.chart || {};

      options.chart.inverted = this.__shouldInvert();

      if (Array.isArray(options.xAxis)) {
        options.xAxis.forEach(
          (e) => (e.opposite = this.__shouldFlipOpposite())
        );
      } else if (options.xAxis) {
        options.xAxis.opposite = this.__shouldFlipOpposite();
      }
    }

    if (this.stacking) {
      options.plotOptions = options.plotOptions || {};
      options.plotOptions.series = options.plotOptions.series || {};
      options.plotOptions.series.stacking = this.stacking;
    }

    if (this.chart3d) {
      options.chart = options.chart || {};

      options.chart.options3d = Object.assign(
        {},
        this._baseChart3d,
        options.chart.options3d
      );
    }

    return options;
  }

  /**
   *  Name of the chart events to add to the configuration and its corresponding event for the chart element
   **/
  get __chartEventNames() {
    return {
      /**
       *
       * @event chart-add-series  Fired when a new series is added
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      addSeries: 'chart-add-series',
      /**
       *
       * @event chart-after-export  Fired after a chart is exported
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      afterExport: 'chart-after-export',
      /**
       *
       * @event chart-after-print  Fired after a chart is printed
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      afterPrint: 'chart-after-print',
      /**
       *
       * @event chart-before-export  Fired before a chart is exported
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      beforeExport: 'chart-before-export',
      /**
       *
       * @event chart-before-print  Fired before a chart is printed
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      beforePrint: 'chart-before-print',
      /**
       *
       * @event chart-click  Fired when clicking on the plot background
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      click: 'chart-click',
      /**
       *
       * @event chart-drilldown  Fired when drilldown point is clicked
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      drilldown: 'chart-drilldown',
      /**
       *
       * @event chart-drillup  Fired when drilling up from a drilldown series
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      drillup: 'chart-drillup',
      /**
       *
       * @event chart-drillupall  Fired after all the series  has been drilled up
       *                          if chart has multiple drilldown series
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      drillupall: 'chart-drillupall',
      /**
       *
       * @event chart-load  Fired when the chart is finished loading
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      load: 'chart-load',
      /**
       *
       * @event chart-redraw  Fired when the chart is redraw. Can be called after a `Chart.configuration.redraw()`
       *                      or after an axis, series or point is modified with the `redraw` option set to `true`
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      redraw: 'chart-redraw',
      /**
       *
       * @event chart-selection  Fired when an area of the chart has been selected
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      selection: 'chart-selection',
    };
  }

  /**
   *  Name of the series events to add to the configuration and its corresponding event for the chart element
   **/
  get __seriesEventNames() {
    return {
      /**
       *
       * @event series-after-animate  Fired when the series has finished its initial animation
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      afterAnimate: 'series-after-animate',
      /**
       *
       * @event series-checkbox-click  Fired when the checkbox next to the series' name in the legend is clicked
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      checkboxClick: 'series-checkbox-click',
      /**
       *
       * @event series-click  Fired when the series is clicked
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      click: 'series-click',
      /**
       *
       * @event series-hide  Fired when the series is hidden after chart generation time
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      hide: 'series-hide',
      /**
       *
       * @event series-legend-item-click  Fired when the legend item belonging to the series is clicked
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      legendItemClick: 'series-legend-item-click',
      /**
       *
       * @event series-mouse-out  Fired when the mouses leave the graph
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      mouseOut: 'series-mouse-out',
      /**
       *
       * @event series-mouse-over  Fired when the mouse enters the graph
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      mouseOver: 'series-mouse-over',
      /**
       *
       * @event series-show  Fired when the series is show after chart generation time
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      show: 'series-show',
    };
  }

  /**
   *  Name of the point events to add to the configuration and its corresponding event for the chart element
   **/
  get __pointEventNames() {
    return {
      /**
       *
       * @event point-click  Fired when the point is clicked
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      click: 'point-click',
      /**
       *
       * @event point-legend-item-click  Fired when the legend item belonging to the point is clicked
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      legendItemClick: 'point-legend-item-click',
      /**
       *
       * @event point-mouse-out  Fired when the mouse leaves the area close to the point
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      mouseOut: 'point-mouse-out',
      /**
       *
       * @event point-mouse-over  Fired when the mouse enters the area close to the point
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      mouseOver: 'point-mouse-over',
      /**
       *
       * @event point-remove  Fired when the point is removed from the series
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      remove: 'point-remove',
      /**
       *
       * @event point-select  Fired when the point is selected etheir programmatically or by clicking on the point
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      select: 'point-select',
      /**
       *
       * @event point-unselect  Fired when the point is unselected etheir programmatically or by clicking on the point
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      unselect: 'point-unselect',
      /**
       *
       * @event point-update  Fired when the point is updated programmatically through `.update()` method
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      update: 'point-update',
    };
  }

  get __xAxesEventNames() {
    return {
      /**
       *
       * @event xaxes-extremes-set  Fired when when the minimum and maximum is set for the x axis
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} axis Point object where the event was sent from
       */
      afterSetExtremes: 'xaxes-extremes-set',
    };
  }

  get __yAxesEventNames() {
    return {
      /**
       *
       * @event yaxes-extremes-set  Fired when when the minimum and maximum is set for the y axis
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} axis Point object where the event was sent from
       */
      afterSetExtremes: 'yaxes-extremes-set',
    };
  }

  __reflow() {
    if (!this.configuration) {
      return;
    }
    beforeNextRender(this, () => {
      this.configuration.reflow();
    });
  }

  __mutationCallback() {
    const { height: componentHeight } = this.getBoundingClientRect();
    const { chartHeight } = this.configuration;

    if (componentHeight !== chartHeight) {
      this.__reflow();
    }
  }

  __addChildObserver() {
    beforeNextRender(this, () => {
      this._childObserver = new FlattenedNodesObserver(this.$.slot, (info) => {
        this.__addSeries(info.addedNodes.filter(this.__filterSeriesNodes));
        this.__removeSeries(info.removedNodes.filter(this.__filterSeriesNodes));
        this.__cleanupAfterSeriesRemoved(
          info.removedNodes.filter(this.__filterSeriesNodes)
        );
      });
    });
  }

  __filterSeriesNodes(node) {
    return (
      node.nodeType === Node.ELEMENT_NODE && node instanceof ChartSeriesElement
    );
  }

  __addSeries(series) {
    if (this.__isSeriesEmpty(series)) {
      return;
    }
    const seriesNodes = Array.from(this.childNodes).filter(
      this.__filterSeriesNodes
    );

    const yAxes = this.configuration.yAxis.reduce((acc, axis, index) => {
      acc[axis.options.id || index] = axis;
      return acc;
    }, {});

    for (let i = 0, len = series.length; i < len; i++) {
      const seriesElement = series[i];
      const {
        yAxis: unit,
        yAxisValueMin: valueMin,
        yAxisValueMax: valueMax,
      } = seriesElement.options;

      const idxOnChildList = seriesNodes.indexOf(seriesElement);
      if (
        !unit &&
        !this.configuration.yAxis.some((e) => e.userOptions.id === undefined)
      ) {
        yAxes[unit] = this.__addAxis({ axisGenerated: true });
      } else if (unit && !yAxes[unit]) {
        yAxes[unit] = this.__addAxis({
          id: unit,
          title: { text: unit },
          axisGenerated: true,
        });
      }
      if (isFinite(valueMin)) {
        this.__setYAxisProps(yAxes, unit, { min: valueMin });
      }
      if (isFinite(valueMax)) {
        this.__setYAxisProps(yAxes, unit, { max: valueMax });
      }

      const seriesConfiguration = this.__updateOrAddSeriesInstance(
        seriesElement.options,
        idxOnChildList,
        false
      );

      seriesElement.setSeries(seriesConfiguration);
    }
    this.__removeAxisIfEmpty();

    this.configuration.redraw();
  }

  __removeSeries(seriesNodes) {
    if (this.__isSeriesEmpty(seriesNodes)) {
      return;
    }

    seriesNodes.forEach((series) => {
      if (series instanceof ChartSeriesElement) {
        series._series.remove();
      }
    });
  }

  __setYAxisProps(yAxes, yAxisId, props) {
    if (yAxisId) {
      yAxes[yAxisId].update(props);
    } else {
      this.configuration.yAxis[0].update(props);
    }
  }

  __isSeriesEmpty(series) {
    return series === null || series.length === 0;
  }

  __cleanupAfterSeriesRemoved(series) {
    if (this.__isSeriesEmpty(series)) {
      return;
    }

    this.__removeAxisIfEmpty();

    // Best effort to make chart display custom empty-text messages when series are removed.
    // This is needed because Highcharts currently doesn't react. A condition not catered for is
    // when all points are removed from all series without removing any series.
    const isEmpty =
      this.configuration.series.length === 0 ||
      this.configuration.series
        .map((e) => e.data.length === 0)
        .reduce((e1, e2) => e1 && e2, true);
    if (isEmpty) {
      this.configuration.hideNoData();
      this.configuration.showNoData(this.emptyText);
    }
  }

  __initChart(options) {
    this.__initEventsListeners(options);
    // Workaround for https://github.com/highcharts/highcharts/issues/7523
    this.__ensureObjectPath(options, 'drilldown.activeDataLabelStyle');
    if (this.timeline) {
      this.configuration = Highcharts.stockChart(this.$.chart, options);
    } else {
      this.configuration = Highcharts.chart(this.$.chart, options);
    }

    // Workaround for https://github.com/highcharts/highcharts/issues/9978
    const elementsToChange = [
      ...Array.from(this.$.chart.getElementsByTagName('h4')).filter(
        (el) => el.style.left === '-9999px'
      ),
      this.configuration.screenReaderRegion,
      this.configuration.tabExitAnchor,
    ];

    elementsToChange.forEach((el) => {
      if (el && el.style) {
        el.style.left = '';
        el.style.top = '-999em';
      }
    });
  }

  /** @private */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__mutationObserver && this.__mutationObserver.disconnect();
    this._childObserver && this._childObserver.disconnect();
  }

  /**
   * Search for axis with given `id`.
   *
   * @param {String} id contains the id that will be searched
   * @param {Boolean} isXAxis indicates if it will remove x or y axes. Defaults to `false`.
   */
  __getAxis(id, isXAxis) {
    id = Number.parseInt(id) || id;
    if (this.configuration) {
      return (
        isXAxis ? this.configuration.xAxis : this.configuration.yAxis
      ).find((axis) => axis.options.id === id);
    }
  }

  /**
   * Add an axis with given options
   *
   * @param {Object} options axis options
   * @param {Boolean} isXAxis indicates if axis is X (`true`) or Y (`false`). Defaults to `false`.
   */
  __addAxis(options, isXAxis) {
    if (this.configuration) {
      this.__createEventListeners(
        isXAxis ? this.__xAxesEventNames : this.__yAxesEventNames,
        options,
        'events',
        'axis'
      );
      return this.configuration.addAxis(options, isXAxis);
    }
  }

  /**
   * Iterates over axes (y or x) and removes whenever it doesn't contain any series and was created for unit
   *
   * @param {Boolean}  isXAxis indicates if it will remove x or y axes. Defaults to `false`.
   */
  __removeAxisIfEmpty(isXAxis) {
    if (this.configuration) {
      (isXAxis ? this.configuration.xAxis : this.configuration.yAxis).forEach(
        (axis) => {
          if (axis.userOptions.axisGenerated && axis.series.length === 0) {
            axis.remove();
          }
        }
      );
    }
  }

  /**
   * Update the chart configuration.
   * This JSON API provides a simple single-argument alternative to the configuration property.
   *
   * Styling properties specified in this configuration will be ignored. To learn about chart styling
   * please see the CSS Styling section above.
   *
   * @param {Object} jsonConfiguration Object chart configuration. Most important properties are:
   *
   * - chart `Object` with options regarding the chart area and plot area as well as general chart options.
   *    Detailed API for chart object is available in [API Site](http://api.highcharts.com/highcharts/chart)
   * - credits `Object` with options regarding the chart area and plot area as well as general chart options.
   *    Detailed API for credits object is available in [API Site](http://api.highcharts.com/highcharts/credits)
   * - labels `Object[]` with HTML labels that can be positioned anywhere in the chart area
   *    Detailed API for labels object is available in [API Site](http://api.highcharts.com/highcharts/labels)
   * - plotOptions `Object` wrapper for config objects for each series type.
   *    Detailed API for plotOptions object is available in [API Site](http://api.highcharts.com/highcharts/plotOptions)
   * - series `Object[]` the actual series to append to the chart.
   *    Detailed API for series object is available in [API Site](http://api.highcharts.com/highcharts/series)
   * - subtitle `Object` the chart's subtitle.
   *    Detailed API for subtitle object is available in [API Site](http://api.highcharts.com/highcharts/subtitle)
   * - title `Object` the chart's main title.
   *    Detailed API for title object is available in [API Site](http://api.highcharts.com/highcharts/title)
   * - tooltip `Object` Options for the tooltip that appears when the user hovers over a series or point.
   *    Detailed API for tooltip object is available in [API Site](http://api.highcharts.com/highcharts/tooltip)
   * - xAxis `Object[]` The X axis or category axis. Normally this is the horizontal axis.
   *    Detailed API for xAxis object is available in [API Site](http://api.highcharts.com/highcharts/xAxis)
   * - yAxis `Object[]` The Y axis or value axis. Normally this is the vertical axis.
   *    Detailed API for yAxis object is available in [API Site](http://api.highcharts.com/highcharts/yAxis)
   * - zAxis `Object[]` The Z axis or depth axis for 3D plots.
   *    Detailed API for zAxis object is available in [API Site](http://api.highcharts.com/highcharts/zAxis)
   *
   * @param {Boolean} resetConfiguration Optional boolean that should be set to true if no other chart configuration was set before or
   *    if existing configuration should be discarded.
   */
  update(jsonConfiguration, resetConfiguration) {
    if (resetConfiguration || !this._jsonConfigurationBuffer) {
      this._jsonConfigurationBuffer = {};
    }

    const configCopy = ChartDeepMerger.__deepMerge({}, jsonConfiguration);
    this.__inflateFunctions(configCopy);
    this._jsonConfigurationBuffer = this.__makeConfigurationBuffer(
      this._jsonConfigurationBuffer,
      configCopy
    );

    beforeNextRender(this, () => {
      if (!this.configuration || !this._jsonConfigurationBuffer) {
        return;
      }

      if (resetConfiguration) {
        const initialOptions = Object.assign(
          {},
          this.options,
          this._jsonConfigurationBuffer
        );

        this.__initChart(initialOptions);

        this._jsonConfigurationBuffer = null;
        return;
      }

      this.configuration.update(this._jsonConfigurationBuffer, false);
      if (this._jsonConfigurationBuffer.credits) {
        this.__updateOrAddCredits(this._jsonConfigurationBuffer.credits);
      }
      if (this._jsonConfigurationBuffer.xAxis) {
        this.__updateOrAddAxes(
          this._jsonConfigurationBuffer.xAxis,
          true,
          false
        );
      }
      if (this._jsonConfigurationBuffer.yAxis) {
        this.__updateOrAddAxes(
          this._jsonConfigurationBuffer.yAxis,
          false,
          false
        );
      }
      if (this._jsonConfigurationBuffer.series) {
        this.__updateOrAddSeries(this._jsonConfigurationBuffer.series, false);
      }
      this._jsonConfigurationBuffer = null;

      this.configuration.redraw();
    });
  }

  __makeConfigurationBuffer(target, source) {
    const _source = Highcharts.merge(source);
    const _target = Highcharts.merge(target);

    this.__mergeConfigurationArray(_target, _source, 'series');
    this.__mergeConfigurationArray(_target, _source, 'xAxis');
    this.__mergeConfigurationArray(_target, _source, 'yAxis');

    return Highcharts.merge(_target, _source);
  }

  __mergeConfigurationArray(target, configuration, entry) {
    if (
      !configuration ||
      !configuration[entry] ||
      !Array.isArray(configuration[entry])
    ) {
      return;
    }

    if (!target[entry]) {
      target[entry] = Array.from(configuration[entry]);
      return;
    }

    const maxLength = Math.max(
      target[entry].length,
      configuration[entry].length
    );
    for (let i = 0; i < maxLength; i++) {
      target[entry][i] = Highcharts.merge(
        target[entry][i],
        configuration[entry][i]
      );
    }
    delete configuration[entry];
  }

  __inflateFunctions(jsonConfiguration) {
    for (const attr in jsonConfiguration) {
      if (jsonConfiguration.hasOwnProperty(attr)) {
        const targetProperty = jsonConfiguration[attr];
        if (
          attr.indexOf('_fn_') === 0 &&
          (typeof targetProperty === 'string' ||
            targetProperty instanceof String)
        ) {
          try {
            jsonConfiguration[attr.substr(4)] = eval(
              '(' + targetProperty + ')'
            );
          } catch (e) {
            jsonConfiguration[attr.substr(4)] = eval(
              '(function(){' + targetProperty + '})'
            );
          }
          delete jsonConfiguration[attr];
        } else if (targetProperty instanceof Object) {
          this.__inflateFunctions(targetProperty);
        }
      }
    }
  }

  __initEventsListeners(configuration) {
    this.__initChartEventsListeners(configuration);
    this.__initSeriesEventsListeners(configuration);
    this.__initPointsEventsListeners(configuration);
    this.__initAxisEventsListeners(configuration, true);
    this.__initAxisEventsListeners(configuration, false);
  }

  __initChartEventsListeners(configuration) {
    this.__createEventListeners(
      this.__chartEventNames,
      configuration,
      'chart.events',
      'chart'
    );
  }

  __initSeriesEventsListeners(configuration) {
    this.__createEventListeners(
      this.__seriesEventNames,
      configuration,
      'plotOptions.series.events',
      'series'
    );
  }

  __initPointsEventsListeners(configuration) {
    this.__createEventListeners(
      this.__pointEventNames,
      configuration,
      'plotOptions.series.point.events',
      'point'
    );
  }

  __initAxisEventsListeners(configuration, isXAxis) {
    let eventNames, axes;

    if (isXAxis) {
      eventNames = this.__xAxesEventNames;
      axes = configuration.xAxis;
    } else {
      eventNames = this.__yAxesEventNames;
      axes = configuration.yAxis;
    }

    if (Array.isArray(axes)) {
      axes.forEach((axis) =>
        this.__createEventListeners(eventNames, axis, 'events', 'axis')
      );
    } else {
      this.__createEventListeners(eventNames, axes, 'events', 'axis');
    }
  }

  __createEventListeners(eventList, configuration, pathToAdd, eventType) {
    const self = this;
    const eventObject = this.__ensureObjectPath(configuration, pathToAdd);

    for (let keys = Object.keys(eventList), i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!eventObject[key]) {
        const chart = this;
        eventObject[key] = function (event) {
          const customEvent = {
            bubbles: false,
            composed: true,
            detail: {
              originalEvent: event,
              [eventType]: this,
            },
          };

          if (event.type === 'afterSetExtremes') {
            if (event.min == null || event.max == null) {
              return;
            }
          }

          // Workaround for vaadin-charts-flow because of https://github.com/vaadin/flow/issues/3102
          if (event.type === 'selection') {
            if (event.xAxis && event.xAxis[0]) {
              customEvent.detail.xAxisMin = event.xAxis[0].min;
              customEvent.detail.xAxisMax = event.xAxis[0].max;
            }
            if (event.yAxis && event.yAxis[0]) {
              customEvent.detail.yAxisMin = event.yAxis[0].min;
              customEvent.detail.yAxisMax = event.yAxis[0].max;
            }
          }
          if (event.type === 'click') {
            if (event.xAxis && event.xAxis[0]) {
              customEvent.detail.xValue = event.xAxis[0].value;
            }
            if (event.yAxis && event.yAxis[0]) {
              customEvent.detail.yValue = event.yAxis[0].value;
            }
          }

          // Workaround for https://github.com/vaadin/vaadin-charts/issues/389
          // Hook into beforePrint and beforeExport to ensure correct styling
          if (['beforePrint', 'beforeExport'].indexOf(event.type) >= 0) {
            // Guard against another print 'before print' event coming before
            // the 'after print' event.
            if (!this.tempBodyStyle) {
              let effectiveCss = '';
              if (nativeShadow) {
                const shadowStyles = self.shadowRoot.querySelectorAll('style');
                for (let i = 0; i < shadowStyles.length; i++) {
                  effectiveCss = effectiveCss + shadowStyles[i].textContent;
                }

                // Strip off host selectors that target individual instances
                effectiveCss = effectiveCss.replace(
                  /:host\(.+?\)/g,
                  (match) => {
                    const selector = match.substr(6, match.length - 7);
                    const matchesFn = self.matches || self.msMatchesSelector;
                    return matchesFn.call(self, selector) ? '' : match;
                  }
                );
              } else {
                effectiveCss = ScopingShim.prototype.styleAstToString(
                  ScopingShim.prototype._styleInfoForNode(self)._getStyleRules()
                );

                // Remove the style scopes added by ShadyCSS
                // e.g. '.vaadin-chart-1 .highcharts-container.vaadin-chart'
                //   -> '.highcharts-container'

                // 1. Web Component instance scope
                const match = self.className.match(/\bvaadin-chart-\d+\b/);
                if (match) {
                  effectiveCss = effectiveCss.replace(
                    new RegExp('\\.' + match[0], 'g'),
                    ''
                  );
                }

                // 2. Web Component tag scope
                effectiveCss = effectiveCss.replace(/\.vaadin-chart/g, '');
              }

              // Zoom out a bit to avoid clipping the chart's edge on paper
              effectiveCss =
                effectiveCss +
                +'body {' +
                '    -moz-transform: scale(0.9, 0.9);' + // Mozilla
                '    zoom: 0.9;' + // Others
                '    zoom: 90%;' + // Webkit
                '}';

              this.tempBodyStyle = document.createElement('style');
              this.tempBodyStyle.textContent = effectiveCss;
              document.body.appendChild(this.tempBodyStyle);
            }
          }

          // Hook into afterPrint and afterExport to revert changes made before
          if (['afterPrint', 'afterExport'].indexOf(event.type) >= 0) {
            if (this.tempBodyStyle) {
              document.body.removeChild(this.tempBodyStyle);
              delete this.tempBodyStyle;
            }
          }

          self.dispatchEvent(new CustomEvent(eventList[key], customEvent));

          if (
            event.type === 'legendItemClick' &&
            chart['_visibilityTogglingDisabled']
          ) {
            return false;
          }
        };
      }
    }
  }

  __ensureObjectPath(object, path) {
    if (typeof path !== 'string') {
      return;
    }

    path = path.split('.');
    return path.reduce((obj, key) => {
      obj[key] = obj[key] || {};
      return obj[key];
    }, object);
  }

  __updateOrAddCredits(credits) {
    if (this.configuration.credits) {
      this.configuration.credits.update(credits);
    } else {
      this.configuration.addCredits(credits);
    }
  }

  __updateOrAddAxes(axes, isX, redraw) {
    if (!Array.isArray(axes)) {
      axes = [axes];
    }
    const confAxes = isX ? this.configuration.xAxis : this.configuration.yAxis;
    for (let i = 0; i < axes.length; i++) {
      const axis = axes[i];
      if (confAxes[i]) {
        confAxes[i].update(axis, redraw);
      } else {
        this.configuration.addAxis(axis, isX, redraw);
      }
    }
  }

  __updateOrAddSeries(series, redraw) {
    if (!Array.isArray(series)) {
      throw new Error(
        'The type of jsonConfiguration.series should be Object[]'
      );
    }
    for (let i = 0; i < series.length; i++) {
      const currentSeries = series[i];
      this.__updateOrAddSeriesInstance(currentSeries, i, redraw);
    }
  }

  __updateOrAddSeriesInstance(seriesOptions, position, redraw) {
    if (this.configuration.series[position]) {
      this.configuration.series[position].update(seriesOptions, redraw);
    } else {
      this.configuration.addSeries(seriesOptions, redraw);
    }
    return this.configuration.series[position];
  }

  __updateCategories() {
    if (!this.configuration) {
      return;
    }

    this.__updateOrAddAxes(
      [
        {
          categories: this.categories,
        },
      ],
      true
    );
  }

  __updateCategoryMax() {
    if (!this.configuration) {
      return;
    }

    if (!isFinite(this.categoryMax)) {
      console.warn(
        '<vaadin-chart> Acceptable value for "category-max" are Numbers or null'
      );
      return;
    }

    this.__updateOrAddAxes(
      [
        {
          max: this.categoryMax,
        },
      ],
      true
    );
  }

  __updateCategoryMin() {
    if (!this.configuration) {
      return;
    }

    if (!isFinite(this.categoryMin)) {
      console.warn(
        '<vaadin-chart> Acceptable value for "category-min" are Numbers or null'
      );
      return;
    }

    this.__updateOrAddAxes(
      [
        {
          min: this.categoryMin,
        },
      ],
      true
    );
  }

  __shouldInvert() {
    // A bar chart will never be inverted, consider using a column chart.
    // See https://stackoverflow.com/questions/11235251#answer-21739793
    if (
      this.type === 'bar' &&
      ['top', 'bottom'].indexOf(this.categoryPosition) >= 0
    ) {
      console.warn(`<vaadin-chart> Acceptable "category-position" values for bar charts are
          "left" and "right". For "top" and "bottom" positions please consider using a column chart.`);
      return;
    }

    const inverted = ['left', 'right'];
    return inverted.indexOf(this.categoryPosition) >= 0;
  }

  __shouldFlipOpposite() {
    const opposite = ['top', 'right'];
    const oppositeBar = ['right'];
    return (
      (this.type === 'bar' ? oppositeBar : opposite).indexOf(
        this.categoryPosition
      ) >= 0
    );
  }

  __updateCategoryPosition() {
    if (!this.configuration) {
      return;
    }

    const validPositions = ['left', 'right', 'top', 'bottom'];

    if (validPositions.indexOf(this.categoryPosition) < 0) {
      console.warn(
        `<vaadin-chart> Acceptable "category-position" values are ${validPositions}`
      );
      return;
    }

    this.configuration.update({
      chart: {
        inverted: this.__shouldInvert(),
      },
    });

    this.configuration.xAxis.forEach((e) =>
      e.update({
        opposite: this.__shouldFlipOpposite(),
      })
    );
  }

  __hideLegend(newValue) {
    if (!this.configuration) {
      return;
    }

    if (this.configuration.legend) {
      this.configuration.legend.update({ enabled: !newValue });
    } else {
      this.configuration.legend = { enabled: !newValue };
    }
  }

  __updateTitle(newValue) {
    if (!this.configuration) {
      return;
    }

    if (newValue && newValue.length > 0) {
      this.configuration.title.update({ text: newValue });
    }
  }

  __tooltipObserver(newValue) {
    if (!this.configuration) {
      return;
    }

    this.configuration.tooltip.update({ enabled: this.tooltip });
  }

  __updateType(newValue) {
    if (!this.configuration) {
      return;
    }

    if (newValue && newValue.length > 0) {
      this.configuration.update({
        chart: {
          type: newValue,
        },
      });
    }
  }

  __updateSubtitle(newValue) {
    if (!this.configuration) {
      return;
    }

    if (newValue && newValue.length > 0) {
      if (!this.configuration.subtitle) {
        this.configuration.setSubtitle({ text: newValue });
      } else {
        this.configuration.subtitle.update({ text: newValue });
      }
    }
  }

  __updateAdditionalOptions() {
    if (this.configuration) {
      this.update(this.additionalOptions);
    }
  }

  __isStackingValid() {
    if (['normal', 'percent', null].indexOf(this.stacking) === -1) {
      this.__showWarn('stacking', '"normal", "percent" or null');
      return false;
    }
    return true;
  }

  __stackingObserver() {
    if (!this.configuration) {
      return;
    }

    if (!this.__isStackingValid()) {
      this.stacking = null;
      return;
    }

    this.configuration.update({
      plotOptions: {
        series: {
          stacking: this.stacking,
        },
      },
    });
  }

  __chart3dObserver() {
    if (!this.configuration) {
      return;
    }

    if (this.chart3d) {
      this.configuration.update({
        chart: {
          options3d: Object.assign(
            {},
            this._baseChart3d,
            this.additionalOptions &&
              this.additionalOptions.chart &&
              this.additionalOptions.chart.options3d,
            { enabled: true }
          ),
        },
      });
    } else {
      this.configuration.update({
        chart: {
          options3d: {
            enabled: false,
          },
        },
      });
    }
  }

  __polarObserver() {
    if (!this.configuration) {
      return;
    }

    this.configuration.update({
      chart: {
        polar: this.polar,
      },
    });
  }

  __emptyTextObserver() {
    if (!this.configuration) {
      return;
    }

    this.configuration.update({
      lang: {
        noData: this.emptyText,
      },
    });
    this.configuration.hideNoData();
    this.configuration.showNoData(this.emptyText);
  }

  __callChartFunction(functionName) {
    if (this.configuration) {
      const functionToCall = this.configuration[functionName];
      const argumentsForCall = Array.prototype.splice.call(arguments, 1);
      if (functionToCall && typeof functionToCall === 'function') {
        functionToCall.apply(this.configuration, argumentsForCall);
      }
    }
  }

  __callSeriesFunction(functionName, seriesIndex) {
    if (this.configuration && this.configuration.series[seriesIndex]) {
      const series = this.configuration.series[seriesIndex];
      const functionToCall = series[functionName];
      const argumentsForCall = Array.prototype.splice.call(arguments, 2);
      if (functionToCall && typeof functionToCall === 'function') {
        functionToCall.apply(series, argumentsForCall);
      }
    }
  }

  __callAxisFunction(functionName, axisCategory, axisIndex) {
    /*
     * axisCategory:
     * 0 - xAxis
     * 1 - yAxis
     * 2 - zAxis
     * 3 - colorAxis
     */
    if (this.configuration) {
      let axes;
      switch (axisCategory) {
        case 0:
          axes = this.configuration.xAxis;
          break;
        case 1:
          axes = this.configuration.yAxis;
          break;
        case 2:
          axes = this.configuration.zAxis;
          break;
        case 3:
          axes = this.configuration.colorAxis;
          break;
      }
      if (axes && axes[axisIndex]) {
        const axis = axes[axisIndex];
        const functionToCall = axis[functionName];
        const argumentsForCall = Array.prototype.splice.call(arguments, 3);
        if (functionToCall && typeof functionToCall === 'function') {
          functionToCall.apply(axis, argumentsForCall);
        }
      }
    }
  }

  __callPointFunction(functionName, seriesIndex, pointIndex) {
    if (
      this.configuration &&
      this.configuration.series[seriesIndex] &&
      this.configuration.series[seriesIndex].data[pointIndex]
    ) {
      const point = this.configuration.series[seriesIndex].data[pointIndex];
      const functionToCall = point[functionName];
      const argumentsForCall = Array.prototype.splice.call(arguments, 3);
      if (functionToCall && typeof functionToCall === 'function') {
        functionToCall.apply(point, argumentsForCall);
      }
    }
  }

  /**
   * Updates chart container and current chart style property depending on flex status
   */
  __updateStyles() {
    // Chrome returns default value if property is not set
    // check if flex is defined for chart, and different than default value
    const isFlex = this._copyStyleProperties.some(
      (property) =>
        getComputedStyle(this)[property] &&
        getComputedStyle(this)[property] != '0 1 auto',
      this
    );

    // If chart element is a flexible item the chartContainer should be flex too
    if (isFlex) {
      this.$.chart.setAttribute(
        'style',
        'flex: 1; -webkit-flex: 1; -ms-flex: 1; '
      );
      let style = '';
      if (this.hasAttribute('style')) {
        style = this.getAttribute('style');
        if (style.charAt(style.length - 1) !== ';') {
          style += ';';
        }
      }
      style += 'display: -ms-flexbox; display: -webkit-flex; display: flex;';
      this.setAttribute('style', style);
    } else {
      this.$.chart.setAttribute('style', 'height:100%; width:100%;');
    }
  }
}

customElements.define(ChartElement.is, ChartElement);

export { ChartElement };
