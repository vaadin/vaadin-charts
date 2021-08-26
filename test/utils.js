window.onChartRender = (function() {
  const evt = 'test-load';

  function mergeAdditionalOptions(vaadinChartEl) {
    const opts = vaadinChartEl.additionalOptions || {};

    const chart = opts.chart || {};
    const events = chart.events || {};
    const prevOnRender = events.render || (() => {
    });

    const plotOptions = opts.plotOptions || {};
    const series = plotOptions.series || {};

    const drilldown = opts.drilldown || {};

    const newEvents = Object.assign(events, {
      render: () => {
        prevOnRender();
        vaadinChartEl.dispatchEvent(new CustomEvent(evt));
      },
    });

    const newChart = Object.assign(chart, {
      animation: false,
      events: newEvents
    });

    const newSeries = Object.assign(series, {
      animation: {
        duration: 0
      }
    });

    const newPlotOptions = Object.assign(plotOptions, {
      series: newSeries,
    });

    const newDrilldown = Object.assign(drilldown, {
      animation: {
        duration: 0
      }
    });

    vaadinChartEl.additionalOptions = Object.assign(opts, {
      chart: newChart,
      plotOptions: newPlotOptions,
      drilldown: newDrilldown
    });
  }

  return function onChartRender(vaadinChartEl, cb, wait) {
    mergeAdditionalOptions(vaadinChartEl);

    let timeoutId = null;

    vaadinChartEl.addEventListener(evt, () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setTimeout(cb, 0);
      }, wait || 50);
    }, {once: true});

    if (vaadinChartEl.configuration && vaadinChartEl.configuration.hasRendered) {
      vaadinChartEl.dispatchEvent(new CustomEvent(evt));
    }
  };
}());
