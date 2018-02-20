(function() {
  window.oldContainsVaadinChart = document.body.contains.bind(document);
  document.body.contains = function(node) {
    return window.oldContainsVaadinChart(node)
    || (node.id === 'chart'
        && node.tagName.toUpperCase() === 'DIV'
        && node.className.indexOf('workaround-for-hc5014') >= 0) ? node.parentNode != null : false;
  };
})();