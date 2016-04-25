System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var VaadinCharts, DataSeries;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            VaadinCharts = (function () {
                function VaadinCharts(_el, zone) {
                    this._el = _el;
                    this.zone = zone;
                    this._chartReady = new core_1.EventEmitter(false);
                    this._element = this._el.nativeElement;
                }
                VaadinCharts.prototype.ngOnInit = function () {
                    var _this = this;
                    // Check that isInitialized is a function so directive can be used without
                    // wrapping application start in WebComponentsReady event
                    if (this._element.isInitialized && this._element.isInitialized()) {
                        this.initChart();
                    }
                    else {
                        this._element.addEventListener('chart-loaded', function () {
                            if (!_this._loaded) {
                                _this.initChart();
                            }
                        });
                    }
                };
                VaadinCharts.prototype.initChart = function () {
                    var _this = this;
                    this._loaded = true;
                    this.fixLightDom();
                    setTimeout(function () {
                        _this._chartReady.emit(true);
                    });
                };
                VaadinCharts.prototype.fixLightDom = function () {
                    var _this = this;
                    // Move all elements targeted to light dom to the actual light dom with Polymer apis
                    var misplaced = this._element.querySelectorAll("*:not(.style-scope)");
                    var chartFound = false;
                    [].forEach.call(misplaced, function (e) {
                        if (e.parentElement === _this._element) {
                            Polymer.dom(_this._element).appendChild(e);
                            chartFound = true;
                        }
                    });
                    // Reload Chart if needed.
                    if (this._element.reloadConfiguration && chartFound) {
                        // Reload outside of Angular to prevent DataSeries.ngDoCheck being called on every mouse event.
                        this.zone.runOutsideAngular(function () {
                            _this._element.reloadConfiguration();
                        });
                    }
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], VaadinCharts.prototype, "_chartReady", void 0);
                VaadinCharts = __decorate([
                    core_1.Directive({
                        selector: "\n  vaadin-area-chart,\n  vaadin-arearange-chart,\n  vaadin-areaspline-chart,\n  vaadin-areasplinerange-chart,\n  vaadin-bar-chart,\n  vaadin-boxplot-chart,\n  vaadin-bubble-chart,\n  vaadin-candlestick-chart,\n  vaadin-column-chart,\n  vaadin-columnrange-chart,\n  vaadin-errorbar-chart,\n  vaadin-flags-chart,\n  vaadin-funnel-chart,\n  vaadin-gauge-chart,\n  vaadin-heatmap-chart,\n  vaadin-line-chart,\n  vaadin-ohlc-chart,\n  vaadin-pie-chart,\n  vaadin-polygon-chart,\n  vaadin-pyramid-chart,\n  vaadin-scatter-chart,\n  vaadin-solidgauge-chart,\n  vaadin-sparkline,\n  vaadin-spline-chart,\n  vaadin-treemap-chart,\n  vaadin-waterfall-chart\n  "
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.NgZone])
                ], VaadinCharts);
                return VaadinCharts;
            }());
            exports_1("VaadinCharts", VaadinCharts);
            DataSeries = (function () {
                function DataSeries(_el, differs, _chart) {
                    this._el = _el;
                    this._chart = _chart;
                    this._chartReady = false;
                    this._differ = differs.find([]).create(null);
                }
                DataSeries.prototype.ngOnInit = function () {
                    var _this = this;
                    this._element = this._el.nativeElement;
                    this._chart._chartReady.subscribe(function (imported) {
                        if (imported) {
                            _this._chartReady = true;
                            // Set data to chart when import is ready.
                            _this.ngDoCheck();
                        }
                    });
                };
                DataSeries.prototype.ngDoCheck = function () {
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
                        }
                        catch (err) {
                            try {
                                this.data = JSON.parse('[' + this.data + ']');
                            }
                            catch (err) {
                                return;
                            }
                        }
                    }
                    var changes = this._differ.diff(this.data);
                    if (changes) {
                        // The data property must be set to a clone of the collection.
                        this._element.data = changes.collection.slice(0);
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DataSeries.prototype, "data", void 0);
                DataSeries = __decorate([
                    core_1.Directive({
                        selector: 'data-series'
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.IterableDiffers, VaadinCharts])
                ], DataSeries);
                return DataSeries;
            }());
            exports_1("DataSeries", DataSeries);
        }
    }
});
//# sourceMappingURL=vaadin-charts.js.map