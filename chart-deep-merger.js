/**
 * @namespace Vaadin
 */
window.Vaadin = window.Vaadin || {};
/**
 * @namespace Vaadin.Charts
 */
Vaadin.Charts = Vaadin.Charts || {};

Vaadin.Charts.deepMerge = function(target, source, extend = false) {
  return Highcharts.merge(extend, target, source);
};
