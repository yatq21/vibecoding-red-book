(function () {
  function nav(to) {
    try {
      window.parent.postMessage({ type: "nav", to }, "*");
    } catch {
      // ignore
    }
  }

  // Expose minimal API
  window.RedBookProto = { nav };

  // Any element with [data-nav] will navigate
  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-nav]");
    if (!target) return;
    e.preventDefault();
    const to = target.getAttribute("data-nav");
    if (to) nav(to);
  });
})();
