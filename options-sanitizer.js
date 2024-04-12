window.sanitizeHighchartsAPI = (Highcharts, DOMPurify) => {
  DOMPurify.setConfig({
    FORCE_BODY: true,
  });
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
  Highcharts.Chart.prototype.update = function(
    options,
    redraw,
    oneToOne,
    animation
  ) {
    options = stripHTMLRecurse(options);
    return update.call(this, options, redraw, oneToOne, animation);
  };

  const newChart = Highcharts.chart;
  Highcharts.chart = function(renderTo, options, callback) {
    options = stripHTMLRecurse(options);
    return newChart.call(this, renderTo, options, callback);
  };

  const newHighstock = Highcharts.stockChart;
  Highcharts.stockChart = function(renderTo, options, callback) {
    options = stripHTMLRecurse(options);
    return newHighstock.call(this, renderTo, options, callback);
  };

  const axisUpdate = Highcharts.Axis.prototype.update;
  Highcharts.Axis.prototype.update = function(options, redraw) {
    options = stripHTMLRecurse(options);
    return axisUpdate.call(this, options, redraw);
  };

  const seriesUpdate = Highcharts.Series.prototype.update;
  Highcharts.Series.prototype.update = function(options, redraw) {
    options = stripHTMLRecurse(options);
    return seriesUpdate.call(this, options, redraw);
  };

  const legendUpdate = Highcharts.Legend.prototype.update;
  Highcharts.Legend.prototype.update = function(options, redraw) {
    options = stripHTMLRecurse(options);
    return legendUpdate.call(this, options, redraw);
  };

  const addCredits = Highcharts.Chart.prototype.addCredits;
  Highcharts.Chart.prototype.addCredits = function(credits) {
    credits = stripHTMLRecurse(credits);
    return addCredits.call(this, credits);
  };

  const setTitle = Highcharts.Chart.prototype.setTitle;
  Highcharts.Chart.prototype.setTitle = function(
    titleOptions,
    subtitleOptions,
    redraw
  ) {
    titleOptions = stripHTMLRecurse(titleOptions);
    subtitleOptions = stripHTMLRecurse(subtitleOptions);
    return setTitle.call(this, titleOptions, subtitleOptions, redraw);
  };

  const tooltipUpdate = Highcharts.Tooltip.prototype.update;
  Highcharts.Tooltip.prototype.update = function(options) {
    options = stripHTMLRecurse(options);
    return tooltipUpdate.call(this, options);
  };
};
