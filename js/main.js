/* =========================================================
   UPFINITY — shared front-end behaviour
   Mobile nav toggle · sticky header shadow · back-to-top ·
   scroll-reveal (progressive enhancement, no external libs)
   ========================================================= */
(function () {
  "use strict";

  var body = document.body;
  body.classList.remove("js-off");

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var header = document.querySelector("header");
  var navLinks = document.querySelectorAll(".nav-links a");

  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Sticky header shadow ---------- */
  if (header) {
    var onScrollHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });
  }

  /* ---------- Back to top ---------- */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    var onScrollTop = function () {
      toTop.classList.toggle("is-visible", window.scrollY > 480);
    };
    onScrollTop();
    window.addEventListener("scroll", onScrollTop, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    }
  }
})();
