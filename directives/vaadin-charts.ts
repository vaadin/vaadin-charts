import {Directive, ElementRef, OnInit, Input} from 'angular2/core';
declare var Polymer;

@Directive({
  selector: `
  vaadin-area-chart,
  vaadin-arearange-chart,
  vaadin-areaspline-chart,
  vaadin-areasplinerange-chart,
  vaadin-bar-chart,
  vaadin-boxplot-chart,
  vaadin-bubble-chart,
  vaadin-candlestick-chart,
  vaadin-column-chart,
  vaadin-columnrange-chart,
  vaadin-errorbar-chart,
  vaadin-flags-chart,
  vaadin-funnel-chart,
  vaadin-gauge-chart,
  vaadin-heatmap-chart,
  vaadin-line-chart,
  vaadin-ohlc-chart,
  vaadin-pie-chart,
  vaadin-polygon-chart,
  vaadin-pyramid-chart,
  vaadin-scatter-chart,
  vaadin-solidgauge-chart,
  vaadin-sparkline,
  vaadin-spline-chart,
  vaadin-treemap-chart,
  vaadin-waterfall-chart
  `
})
export class VaadinCharts implements OnInit {

  private _element;

  constructor(private _el: ElementRef) {
  }

  ngOnInit() {
    this.import();
  }

  import() {
    this._element = this._el.nativeElement;
    Polymer.Base.importHref('bower_components/vaadin-charts/' + this._element.tagName.toLowerCase() + '.html', this.onImport.bind(this));
  }

  onImport(e) {
    if (this._element.reloadConfiguration) {
      // Charts need reloadConfiguration called if light dom configuration changes dynamically
      this._element.reloadConfiguration();
    }
  }
}

@Directive({
  selector: 'data-series'
})
export class DataSeries implements OnInit {

  private _element;

  @Input()
  data: any;

  constructor(private _el: ElementRef) {
  }

  ngOnInit() {
    this._element = this._el.nativeElement;
    this.setData();
    this.observeDataChange();
  }

  setData() {
    var self = this;
    this._element.data = this.data;
  }

  observeDataChange() {
    //TODO Implementing observer that checks when this.data is changed and sets it to this._element.data
  }
}
