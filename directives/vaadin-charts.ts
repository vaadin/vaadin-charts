import {
Directive,
ElementRef,
OnInit,
Input,
Component,
DoCheck,
IterableDiffers,
Output,
EventEmitter,
NgZone
} from 'angular2/core';
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
  private _loaded;

  @Output() _chartReady: EventEmitter<any> = new EventEmitter(false);

  constructor(private _el: ElementRef, private zone: NgZone) {
    this._element = this._el.nativeElement;
  }

  ngOnInit() {
    // Check that isInitialized is a function so directive can be used without
    // wrapping application start in WebComponentsReady event
    if (this._element.isInitialized && this._element.isInitialized()) {
      this.initChart();
    } else {
      this._element.addEventListener('chart-loaded',( ) => {
        if (!this._loaded) {
          this.initChart();
        }
      });
    }
  }

  initChart() {
    this._loaded = true;
    this.fixLightDom();
    setTimeout(()=> {
      this._chartReady.emit(true);
    });
  }

  fixLightDom() {
    // Move all elements targeted to light dom to the actual light dom with Polymer apis
    const misplaced = this._element.querySelectorAll("*:not(.style-scope)");
    var chartFound = false;
    [].forEach.call(misplaced, (e) => {
      if (e.parentElement === this._element) {
        Polymer.dom(this._element).appendChild(e);
        chartFound = true;
      }
    });

    // Reload Chart if needed.
    if (this._element.reloadConfiguration && chartFound) {
    // Reload outside of Angular to prevent DataSeries.ngDoCheck being called on every mouse event.
      this.zone.runOutsideAngular(() => {
        this._element.reloadConfiguration();
      });
    }
  }
}

@Directive({
  selector: 'data-series'
})
export class DataSeries implements OnInit, DoCheck {

  private _element;
  private _differ;
  private _chartReady = false;

  @Input()
  data: any;

  constructor(private _el: ElementRef, differs: IterableDiffers, private _chart: VaadinCharts) {
    this._differ = differs.find([]).create(null);
  }

  ngOnInit() {
    this._element = this._el.nativeElement;
    this._chart._chartReady.subscribe((imported) => {
      if (imported) {
        this._chartReady = true;
        // Set data to chart when import is ready.
        this.ngDoCheck();
      }
    });
  }

  ngDoCheck() {
    // Don't update data if charts are not imported
    if (!this._chartReady) {
      return;
    }

    // This is needed to be able to specify data as a string.
    // <data-series data="[123,32,42,11]"> </data-series> won't work without it.
    if (typeof (this.data) !== 'object') {
      try {
        this.data = JSON.parse(this.data);
        if (typeof (this.data) !== 'object') {
          throw 'type is not object';
        }
      } catch (err) {
        try {
          this.data = JSON.parse('[' + this.data + ']');
        } catch (err) {
          return;
        }
      }
    }
    const changes = this._differ.diff(this.data);

    if (changes) {
      // The data property must be set to a clone of the collection.
      this._element.data = changes.collection.slice(0);
    }
  }
}
