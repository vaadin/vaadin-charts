(() => {
  window.defer = (callback, delay) => {
    const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    if (isIE11) {
      requestAnimationFrame(() => setTimeout(callback, delay));
    } else {
      requestAnimationFrame(() => callback());
    }
  };
})();