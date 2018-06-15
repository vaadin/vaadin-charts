(function() {
  if (Highcharts) {
    Highcharts.wrap(
      Highcharts.seriesTypes.column.prototype,
      'plotGroup',
      function(proceed, prop, name, visibility, zIndex, parent) {
        if (this.chart.is3d() && this[prop]) {
          delete this[prop];
        }
        return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
      }
    );
  }
}());
