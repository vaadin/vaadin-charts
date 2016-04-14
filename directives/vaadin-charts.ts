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
  private _imported;

  @Output() importReady: EventEmitter<any> = new EventEmitter(false);

  constructor(private _el: ElementRef, private zone: NgZone) {
  }

  ngOnInit() {
    this.import();
  }

  import() {
    this._imported = false;
    this._element = this._el.nativeElement;
    this.importHref('bower_components/vaadin-charts/' + this._element.tagName.toLowerCase() + '.html');
  }

  importHref(href) {
    const link = document.createElement('link');
    link.rel = 'import';
    link.href = href;
    link.onload = this.onImport.bind(this);
    document.head.appendChild(link);
  }

  onImport() {
    this._imported = true;
    this.importReady.emit(true);
    setTimeout(function(){
      this.fixLightDom();
    }.bind(this));
  }

  isImported() {
    return this._imported;
  }

  fixLightDom() {
    // Move all elements targeted to light dom to the actual light dom with Polymer apis
    const misplaced = this._element.querySelectorAll("*:not(.style-scope)");
    [].forEach.call(misplaced, (e) => {
      if (e.parentElement === this._element) {
        Polymer.dom(this._element).appendChild(e);
      }
    });
    if (this._element.reloadConfiguration) {
      var self = this;
      this.zone.runOutsideAngular(() => {
        self._element.reloadConfiguration();
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

  @Input()
  data: any;

  constructor(private _el: ElementRef, differs: IterableDiffers, private _chart: VaadinCharts) {
    this._differ = differs.find([]).create(null);
  }

  ngOnInit() {
    this._element = this._el.nativeElement;
  }

  ngDoCheck() {
    //TODO This method is invoked on every event, this may effect performance. TEST IT.

    if (!this._chart.isImported()) {
      return;
    }

    //This is needed to be able to specify data as a string, because differ.diff, raises an exception
    // when getting string as an input.
    //<data-series data="[123,32,42,11]"> </data-series> won't work without it
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

      // The items property must be set to a clone of the collection because of
      // how iron-list behaves.
      this._element.data = changes.collection.slice(0);
    }
  }
}
