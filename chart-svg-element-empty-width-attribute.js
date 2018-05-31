(function() {
  if (Highcharts) {
    // Workaround for https://github.com/vaadin/vaadin-charts/issues/294
    Highcharts.SVGElement.prototype.strokeWidth = function() {
      var val = this.getStyle('stroke-width'),
        ret,
        dummy;

      // Read pixel values directly
      if (val.indexOf('px') === val.length - 2) {
        ret = Highcharts.pInt(val);

        // Other values like em, pt etc need to be measured
      } else {
        dummy = Highcharts.doc.createElementNS(Highcharts.SVGElement.prototype.SVG_NS, 'rect');

        const attributes = {
          'stroke-width': 0
        };
        if (val) {
          attributes.width = val;
        }

        this.attr(dummy, attributes);
        this.element.parentNode.appendChild(dummy);
        ret = dummy.getBBox().width;
        dummy.parentNode.removeChild(dummy);
      }
      return ret;
    };
  }
})();
