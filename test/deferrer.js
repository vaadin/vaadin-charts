(() => {
  const rAF = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame;

  var evaluateLater = (callback, delay) => {
    const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    const isSafari = navigator.vendor.indexOf('Apple') >= 0;

    // IE and Safari incorrectly execute rAF after render steps.
    // https://bugs.webkit.org/show_bug.cgi?id=177484
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15469349/
    if (isIE11 || isSafari) {
      rAF(() => setTimeout(callback, delay));
    } else {
      rAF(() => callback());
    }
  };

  window.evaluateLater = evaluateLater;
})();