/* ================================================================
   THEME — light / dark switch

   How it behaves:
   - First visit: follows the OS setting (prefers-color-scheme).
   - While the visitor hasn't touched the switch, the page keeps following
     the OS live (e.g. macOS auto dark mode at sunset).
   - Once they use the switch, their choice is remembered in localStorage
     and wins over the OS from then on.

   This file is loaded as a plain blocking <script> in <head> on purpose:
   the first block below sets data-theme on <html> before the browser paints
   anything, so there is never a flash of the wrong theme. The switch
   wiring waits for the DOM.
   ================================================================ */
(function () {
  "use strict";

  var STORAGE_KEY = "vivasan-theme";
  var THEME_COLOR = { dark: "#0a0714", light: "#f6f1ff" }; // browser UI bar tint
  var root = document.documentElement;

  // "light" only when the OS clearly asks for it; anything else (including
  // browsers with no support) gets the original dark design.
  var lightQuery = window.matchMedia("(prefers-color-scheme: light)");

  function readSaved() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return v === "light" || v === "dark" ? v : null;
    } catch (e) {
      return null; // storage blocked (private mode, etc.) — just don't persist
    }
  }

  function save(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
  }

  function systemTheme() {
    return lightQuery.matches ? "light" : "dark";
  }

  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  // The theme the visitor has asked for. Usually equals currentTheme(), but
  // during the reveal animation the DOM swap lags a frame or two behind the
  // click, so clicks read this instead — a quick double-click then flips twice
  // instead of reading the stale theme both times.
  var intended;

  function apply(theme) {
    intended = theme;
    root.setAttribute("data-theme", theme);

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_COLOR[theme]);

    var btn = document.getElementById("themeToggle");
    if (btn) btn.setAttribute("aria-checked", String(theme === "dark"));

    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
  }

  // ---- 1. Runs immediately, before first paint ----------------------
  apply(readSaved() || systemTheme());

  // ---- 2. Everything else ------------------------------------------
  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* Swap themes with a circular reveal growing out of the switch, using
     the View Transitions API. Browsers without it (or visitors who asked
     for reduced motion) just get an instant swap. */
  function switchTo(theme, originEl) {
    if (!document.startViewTransition || prefersReducedMotion()) {
      apply(theme);
      return;
    }

    var rect = originEl.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;
    var radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    var transition = document.startViewTransition(function () { apply(theme); });

    transition.ready
      .then(function () {
        root.animate(
          {
            clipPath: [
              "circle(0px at " + x + "px " + y + "px)",
              "circle(" + radius + "px at " + x + "px " + y + "px)"
            ]
          },
          {
            duration: 650,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)"
          }
        );
      })
      .catch(function () { /* transition was skipped (tab hidden, superseded…) */ });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;

    btn.setAttribute("aria-checked", String(currentTheme() === "dark"));

    btn.addEventListener("click", function () {
      var next = intended === "dark" ? "light" : "dark";
      intended = next;
      save(next);
      switchTo(next, btn);
    });
  });

  // Keep following the OS until the visitor makes their own choice.
  function onSystemChange() {
    if (!readSaved()) apply(systemTheme());
  }
  if (lightQuery.addEventListener) lightQuery.addEventListener("change", onSystemChange);
  else if (lightQuery.addListener) lightQuery.addListener(onSystemChange); // old Safari

  // Same site open in another tab? Stay in sync with it.
  window.addEventListener("storage", function (e) {
    if (e.key === STORAGE_KEY) apply(readSaved() || systemTheme());
  });
})();