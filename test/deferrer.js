(() => {
  const rAF = window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.oRequestAnimationFrame ||
              window.msRequestAnimationFrame;

  window.defer = (callback, delay) => {
    const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    if (isIE11 || delay) {
      rAF(() => setTimeout(callback, delay));
    } else {
      rAF(() => callback());
    }
  };
})();