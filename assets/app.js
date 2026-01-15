(function () {
  const routes = {
    home: "pages/home.html",
    search: "pages/search.html",
    publish: "pages/publish.html",
    messages: "pages/messages.html",
    profile: "pages/profile.html",
    detail: "pages/detail.html",
  };

  function getRouteFromHash() {
    const hash = (location.hash || "#home").replace("#", "");
    // support #detail?from=home
    const key = hash.split("?")[0];
    return routes[key] ? key : "home";
  }

  function setActiveTab(routeKey) {
    const activeKey = routeKey === "detail" ? "home" : routeKey;

    document.querySelectorAll("[data-route]").forEach((el) => {
      const isActive = el.getAttribute("data-route") === activeKey;
      el.classList.toggle("active", isActive);
      el.setAttribute("aria-current", isActive ? "page" : "false");
    });

    const titleMap = {
      home: "首页",
      search: "发现",
      publish: "发布",
      messages: "消息",
      profile: "我的",
      detail: "笔记",
    };

    const titleEl = document.getElementById("pageTitle");
    if (titleEl) titleEl.textContent = titleMap[routeKey] || "原型";
  }

  function navigate(routeKey) {
    const frame = document.getElementById("frame");
    if (!frame) return;

    frame.src = routes[routeKey];
    setActiveTab(routeKey);

    // keep hash in sync, but avoid infinite loop
    if (location.hash.replace("#", "").split("?")[0] !== routeKey) {
      location.hash = routeKey;
    }
  }

  function wireTabs() {
    document.querySelectorAll("[data-route]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const key = el.getAttribute("data-route");
        navigate(key);
      });
    });
  }

  function wireFrameMessages() {
    // Allow pages to request navigation: window.parent.postMessage({ type:'nav', to:'detail' }, '*')
    window.addEventListener("message", (event) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "nav" && typeof data.to === "string") {
        navigate(data.to);
      }
    });
  }

  function onHashChange() {
    navigate(getRouteFromHash());
  }

  function init() {
    wireTabs();
    wireFrameMessages();
    onHashChange();
    window.addEventListener("hashchange", onHashChange);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
