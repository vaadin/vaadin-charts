import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="speedometer" theme-for="vaadin-chart">
  <template>
    <style include="vaadin-chart-default-theme">
      :host(.speedometer) .highcharts-minor-tick {
        stroke: #339;
        stroke-width: 1;
      }

      :host(.speedometer) .highcharts-tick,
      :host(.speedometer) .highcharts-axis-line {
        stroke: #339;
        stroke-width: 2;
      }

      :host(.speedometer) .highcharts-label {
        fill: #339;
      }

      :host(.speedometer) .highcharts-grid-line,
      :host(.speedometer) .highcharts-minor-grid-line {
        stroke: none;
      }

      :host(.speedometer) .highcharts-color-0 .highcharts-pivot {
        fill: #000;
        stroke: #000;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
class ChartsHighLevelElementApi extends DemoReadyEventEmitter(ChartsDemo(PolymerElement)) {
  static get template() {
    return html`
    <style include="vaadin-component-demo-shared-styles">
      :host {
        display: block;
      }
    </style>

    <h3>Using the high-level Element API</h3>
    <vaadin-demo-snippet id="charts-high-level-element-api-example">
      <template preserve-content="">
        <vaadin-chart title="Custom Title" no-legend="" subtitle="Custom Subtitle" categories="[2010, 2011, 2012, 2013, 2014]" tooltip="" additional-options="{&quot;yAxis&quot;: [{&quot;id&quot;: &quot;Rainfall (mm)&quot;, &quot;title&quot;: {&quot;text&quot;: &quot;Rainfall (mm)&quot;}},{&quot;id&quot;: &quot;Temperature&quot;, &quot;opposite&quot;: true, &quot;title&quot;: {&quot;text&quot;: &quot;Temperature&quot;}}],&quot;credits&quot;: {&quot;enabled&quot;: true, &quot;text&quot;: &quot;Vaadin Ltd&quot;, &quot;href&quot;: &quot;https://vaadin.com/elements&quot;}}">
          <vaadin-chart-series type="column" title="Tokyo" values="[19,12,9,24,5]" unit="Rainfall (mm)" value-labels="[&quot;Mon&quot;, &quot;Tue&quot;, &quot;Wed&quot;, &quot;Thur&quot;, &quot;Fri&quot;]"></vaadin-chart-series>
          <vaadin-chart-series title="Miami" values="[9,2,29,4,35]" markers="hidden" unit="Temperature"></vaadin-chart-series>
          <vaadin-chart-series title="Rio" values="[39,22,9,14,5]" value-min="-10"></vaadin-chart-series>
        </vaadin-chart>
      </template>
    </vaadin-demo-snippet>

    <h3>Gauge chart</h3>
    <vaadin-demo-snippet id="charts-high-level-element-api-example">
      <template preserve-content="">
        <dom-module id="speedometer" theme-for="vaadin-chart">
          <template>
            <style include="vaadin-chart-default-theme">
              :host(.speedometer) .highcharts-minor-tick {
                stroke: #339;
                stroke-width: 1;
              }

              :host(.speedometer) .highcharts-tick,
              :host(.speedometer) .highcharts-axis-line {
                stroke: #339;
                stroke-width: 2;
              }

              :host(.speedometer) .highcharts-label {
                fill: #339;
              }

              :host(.speedometer) .highcharts-grid-line,
              :host(.speedometer) .highcharts-minor-grid-line {
                stroke: none;
              }

              :host(.speedometer) .highcharts-color-0 .highcharts-pivot {
                fill: #000;
                stroke: #000;
              }
            </style>
          </template>
        </dom-module>
        <vaadin-chart class="speedometer" title="Speedometer" type="gauge" additional-options="{&quot;yAxis&quot;: {
              &quot;min&quot;: 0,
              &quot;max&quot;: 220,
              &quot;minorTickLength&quot;: 5,
              &quot;offset&quot;: -10,
              &quot;tickLength&quot;: 5
            }, &quot;pane&quot;: {&quot;startAngle&quot;: -150, &quot;endAngle&quot;: 150}}">
          <vaadin-chart-series title="Speed" values="[89]"></vaadin-chart-series>
        </vaadin-chart>
      </template>
    </vaadin-demo-snippet>

    <h3>Using the DOM API</h3>
    <vaadin-demo-snippet id="charts-using-the-dom-api">
      <template preserve-content="">
        <wc-api-demo></wc-api-demo>
        <dom-module id="wc-api-demo">
          <template preserve-content="">
            <vaadin-chart id="mychart" title="Custom Title" subtitle="Custom Subtitle">
              <vaadin-chart-series values="[19,12,9,24,5]"></vaadin-chart-series>
            </vaadin-chart>
            <button on-click="_addSeries">Add series</button>
            <button on-click="_addMultipleSeries">Add multiple series</button>
            <button on-click="_removeSeries">Remove series</button>
            <button on-click="_changeSeries">Change first series</button>
          </template>

          <script>
            window.addDemoReadyListener('#charts-using-the-dom-api', function() {
              class WCApiDemoElement extends Polymer.Element {
                static get is() {
                  return 'wc-api-demo';
                }

                _removeSeries() {
                  const series = this.\$.mychart.querySelector('vaadin-chart-series');
                  series && this.\$.mychart.removeChild(series);
                }

                _changeSeries() {
                  const series = this.\$.mychart.querySelector('vaadin-chart-series');
                  if (series) {
                    series.values = this._valuesGenerator;
                  }
                }

                _addSeries() {
                  const newSeries = document.createElement('vaadin-chart-series');
                  newSeries.values = this._valuesGenerator;
                  this.\$.mychart.appendChild(newSeries);
                }

                _addMultipleSeries() {
                  const frag = document.createDocumentFragment();
                  const numSeries = Math.floor(Math.random() * 10);
                  for (let i = 0; i < numSeries; i++) {
                    const newSeries = document.createElement('vaadin-chart-series');
                    newSeries.values = this._valuesGenerator;

                    frag.appendChild(newSeries);
                  }
                  this.\$.mychart.appendChild(frag);
                }

                get _valuesGenerator() {
                  return [Math.random() * 19, Math.random() * 12, Math.random() * 9, Math.random() * 24, Math.random() * 5];
                }
              }
              if (!customElements.get(WCApiDemoElement.is)) {
                customElements.define(WCApiDemoElement.is, WCApiDemoElement);
              }
            });
          &lt;/script>
        </dom-module>
      </template>
    </vaadin-demo-snippet>

    <h3>Multiple series with dom-repeat</h3>
    <vaadin-demo-snippet id="charts-multiple-series-with-dom-repeat">
      <template preserve-content="">
        <dom-module id="chart-series-dom-repeat">
          <template preserve-content="">
            <vaadin-chart id="mychart">
              <template is="dom-repeat" items="{{series}}" preserve-content="">
                <vaadin-chart-series values="{{item.data}}"></vaadin-chart-series>
              </template>
            </vaadin-chart>
          </template>

          <script>
            window.addDemoReadyListener('#charts-multiple-series-with-dom-repeat', function() {
              class ChartSeriesDomRepeatElement extends Polymer.Element {
                static get is() {
                  return 'chart-series-dom-repeat';
                }

                static get properties() {
                  return {
                    series: {
                      type: Array,
                      value: () => {
                        return [
                          {'data': [10096761, 6990386, 9830199, 10373255, 7903685, 8713277, 10606107, 10227879, 9225719, 11987894]},
                          {'data': [9545219, 9425618, 10835399, 8084422, 8541604, 10266319, 7586920, 8778721, 9379301, 10443877, 9771264, 8948669]},
                          {'data': [8881128, 9330959, 9882444, 8594214, 9153243, 10109828, 9706285, 9005619, 7717883, 10727544, 9155228, 8765827]}
                        ];
                      }
                    }
                  };
                }
              }
              if (!customElements.get(ChartSeriesDomRepeatElement.is)) {
                customElements.define(ChartSeriesDomRepeatElement.is, ChartSeriesDomRepeatElement);
              }
            });
          &lt;/script>
        </dom-module>
        <chart-series-dom-repeat></chart-series-dom-repeat>
      </template>
    </vaadin-demo-snippet>

    <h3>Adding event listeners <small>(Try clicking at chart background and any series point)</small></h3>
    <vaadin-demo-snippet id="charts-add-event-listeners">
      <template preserve-content="">
        <dom-module id="chart-event-listeners">
          <template preserve-content="">
            <vaadin-chart title="Chart with events" id="mychart" on-chart-click="__onChartClick">
              <vaadin-chart-series values="[10,20,30]"></vaadin-chart-series>
            </vaadin-chart>
          </template>

          <script>
            window.addDemoReadyListener('#charts-add-event-listeners', function() {
              class ChartEventListeners extends Polymer.Element {
                static get is() {
                  return 'chart-event-listeners';
                }

                __onChartClick(event) {
                  const {chartX, chartY} = event.detail.originalEvent;
                  this.showLabel('[CHART-CLICK] (x: ' + chartX + ', y: ' + chartY + ')', chartX, chartY);
                }

                connectedCallback() {
                  super.connectedCallback();
                  this.\$.mychart.addEventListener('point-click', (event) => {
                    const {chartX, chartY} = event.detail.originalEvent;
                    this.showLabel('[POINT-CLICK] (x: ' + chartX + ', y: ' + chartY + ')', chartX, chartY);
                  });
                }

                showLabel(message, xPixels, yPixels) {
                  const label = this.\$.mychart.configuration.renderer.label(message, xPixels, yPixels)
                    .attr({
                      padding: 10,
                      r: 5,
                      zIndex: 1000
                    })
                    .css({
                      color: '#FF0000'
                    })
                    .add();
                  setTimeout(function() {
                    label.fadeOut();
                  }, 1000);
                }
              }
              if (!customElements.get(ChartEventListeners.is)) {
                customElements.define(ChartEventListeners.is, ChartEventListeners);
              }
            });
          &lt;/script>
        </dom-module>
        <chart-event-listeners></chart-event-listeners>
      </template>
    </vaadin-demo-snippet>

    <h3>3D column chart with stacks</h3>
    <vaadin-demo-snippet id="charts-add-event-listeners">
      <template preserve-content="">
        <vaadin-chart type="column" chart3d="" categories="[&quot;Apples&quot;, &quot;Oranges&quot;]" stacking="normal">
          <vaadin-chart-series title="John" values="[5,3]" stack="male"></vaadin-chart-series>
          <vaadin-chart-series title="Joe" values="[1,2]" stack="male"></vaadin-chart-series>
          <vaadin-chart-series title="Jane" values="[4,16]" stack="female"></vaadin-chart-series>
          <vaadin-chart-series title="Janet" values="[9,5]" stack="female"></vaadin-chart-series>
        </vaadin-chart>
      </template>
    </vaadin-demo-snippet>

    <h3>3D pie chart</h3>
    <vaadin-demo-snippet id="charts-add-event-listeners">
      <template preserve-content="">
        <vaadin-chart type="pie" chart3d="" additional-options="{&quot;plotOptions&quot;: {&quot;pie&quot;: {&quot;depth&quot;: 50}}}">
          <vaadin-chart-series values="[[&quot;Firefox&quot;, 45.0], [&quot;IE&quot;, 26.8], [&quot;Chrome&quot;, 12.8], [&quot;Safari&quot;, 8.5], [&quot;Opera&quot;, 6.2], [&quot;Others&quot;, 0.7]]"></vaadin-chart-series>
        </vaadin-chart>
      </template>
    </vaadin-demo-snippet>
`;
  }

  static get is() {
    return 'charts-high-level-element-api';
  }
}
customElements.define(ChartsHighLevelElementApi.is, ChartsHighLevelElementApi);
