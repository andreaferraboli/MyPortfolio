/* Shared behaviour for index.html and books.html. No dependencies. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- theme toggle (initial theme is set inline in <head> to avoid a flash) ---- */
  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    var sync = function () {
      var dark = currentTheme() === "dark";
      btn.setAttribute("aria-pressed", String(dark));
    };
    sync();
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      sync();
    });
  });

  /* ---- mobile menu ---- */
  var menuBtn = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.querySelector("i").className = open ? "bx bx-x" : "bx bx-menu";
    };
    menuBtn.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        menuBtn.focus();
      }
    });
  }

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".hero, .meters").forEach(function (el) {
      el.classList.add("is-in");
    });
    return;
  }

  /* ---- active section in the nav ---- */
  var links = nav ? nav.querySelectorAll('a[href^="#"]') : [];
  if (links.length) {
    var byId = {};
    links.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.remove("is-active");
          });
          var link = byId[entry.target.id];
          if (link) link.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* ---- one-shot reveals: hero load sequence and skill meters ---- */
  var once = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );
  document.querySelectorAll(".hero, .meters").forEach(function (el) {
    once.observe(el);
  });

  /* ---- marquee: duplicate the group so the loop is seamless ---- */
  document.querySelectorAll(".marquee__track").forEach(function (track) {
    var group = track.querySelector(".marquee__group");
    if (!group) return;
    var copy = group.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    copy.querySelectorAll("img").forEach(function (img) {
      img.setAttribute("alt", "");
    });
    track.appendChild(copy);
  });

  /* ---- contact video: load and play only when visible, never with reduced motion ---- */
  var video = document.querySelector(".contact__video");
  if (video) {
    // skip the 14 MB clip on phones and when the visitor asked for less motion or data
    var saveData = navigator.connection && navigator.connection.saveData;
    if (reduceMotion || saveData || window.matchMedia("(max-width: 640px)").matches) {
      video.remove();
    } else {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var p = video.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            video.pause();
          }
        });
      }).observe(video);
    }
  }
})();
