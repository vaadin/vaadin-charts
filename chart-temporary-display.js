(function() {
  if (Highcharts) {
    Highcharts.Chart.prototype.temporaryDisplay = function(revert) {
      var node = this.renderTo,
        tempStyle;
      if (!revert) {
        while (node && node.style) {

          // When rendering to a detached node, it needs to be temporarily
          // attached in order to read styling and bounding boxes (#5783,
          // #7024).
          if (!document.body.contains(node) && !node.parentNode) {
            node.hcOrigDetached = true;
            document.body.appendChild(node);
          }
          if (
            Highcharts.getStyle(node, 'display', false) === 'none' ||
            node.hcOricDetached
          ) {
            node.hcOrigStyle = {
              display: node.style.display,
              height: node.style.height,
              overflow: node.style.overflow
            };
            tempStyle = {
              display: 'block',
              overflow: 'hidden'
            };
            if (node !== this.renderTo) {
              tempStyle.height = 0;
            }

            Highcharts.css(node, tempStyle);

            // If it still doesn't have an offset width after setting
            // display to block, it probably has an !important priority
            // #2631, 6803
            if (!node.offsetWidth) {
              node.style.setProperty('display', 'block', 'important');
            }
          }
          node = node.parentNode;

          if (node === document.body) {
            break;
          }
        }
      } else {
        while (node && node.style) {
          if (node.hcOrigStyle) {
            Highcharts.css(node, node.hcOrigStyle);
            delete node.hcOrigStyle;
          }
          if (node.hcOrigDetached) {
            document.body.removeChild(node);
            node.hcOrigDetached = false;
          }
          node = node.parentNode;
        }
      }
    };
  }
})();
