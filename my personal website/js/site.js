/* Shared behaviour for index.html and books.html. No dependencies.
   The cinematic layer (2026-10-12) adds: header over the hero, scroll progress, scroll
   reveals, parallax chapter backgrounds, timeline fill, hero video/spotlight/scramble, magnetic buttons,
   tilt cards and meter counters. Everything is skipped with prefers-reduced-motion,
   and pointer effects only run with a fine pointer. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var motionOK = !reduceMotion;

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

  /* ---- header: transparent over the hero, solid after it ---- */
  var header = document.querySelector(".site-header");
  var hero = document.querySelector(".hero");
  var pageHero = hero || document.querySelector(".page-hero");
  var menuOpen = false;
  function syncHeader() {
    if (!header) return;
    var solid = true;
    if (pageHero && !menuOpen) {
      solid = pageHero.getBoundingClientRect().bottom <= header.offsetHeight + 1;
    }
    header.classList.toggle("is-solid", solid);
    header.classList.toggle("is-over", !solid && window.scrollY > 8);
  }

  /* ---- mobile menu ---- */
  var menuBtn = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    var setOpen = function (open) {
      menuOpen = open;
      nav.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.querySelector("i").className = open ? "bx bx-x" : "bx bx-menu";
      syncHeader();
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

  /* ---- reveal hooks: mask titles, index stagger children ---- */
  document.querySelectorAll("[data-lines]").forEach(function (el) {
    var inner = document.createElement("span");
    inner.className = "line-in";
    while (el.firstChild) inner.appendChild(el.firstChild);
    el.appendChild(inner);
  });
  document.querySelectorAll("[data-stagger]").forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (child, i) {
      child.style.setProperty("--i", String(Math.min(i, 10)));
    });
  });

  var revealSel = ".hero, .meters, [data-lines], [data-rise], [data-stagger]";

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(revealSel).forEach(function (el) {
      el.classList.add("is-in");
    });
    syncHeader();
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

  /* ---- one-shot reveals ---- */
  var once = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
          if (entry.target.classList.contains("meters")) countMeters(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -10% 0px" }
  );
  document.querySelectorAll(revealSel).forEach(function (el) {
    once.observe(el);
  });

  /* ---- meter values count up with the bar (after the 21st Number Ticker) ---- */
  function countMeters(list) {
    if (!motionOK) return;
    list.querySelectorAll(".meter__value").forEach(function (el) {
      var target = parseInt(el.textContent, 10);
      if (!target) return;
      var start = performance.now();
      var dur = 1200;
      var step = function (now) {
        var t = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + "%";
        if (t < 1) requestAnimationFrame(step);
      };
      el.textContent = "0%";
      requestAnimationFrame(step);
    });
  }

  /* ---- scroll-linked work: progress bar, parallax, timeline fill, header ---- */
  var bar = document.querySelector(".scroll-progress span");
  var parallax = [];
  var visible = new Set();
  document.querySelectorAll("[data-parallax]").forEach(function (el) {
    var img = el.querySelector(".scene__img");
    if (img) parallax.push({ el: el, img: img });
  });
  var timelines = Array.prototype.slice.call(document.querySelectorAll(".timeline"));

  if (motionOK && parallax.length) {
    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      requestTick();
    });
    parallax.forEach(function (p) {
      pio.observe(p.el);
    });
  }

  var ticking = false;
  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }

  function onScroll() {
    ticking = false;
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.setProperty("--progress", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
    syncHeader();

    if (motionOK) {
      parallax.forEach(function (p) {
        if (!visible.has(p.el) || !p.img.isConnected) return;
        var r = p.el.getBoundingClientRect();
        // -1 when the section enters at the bottom, 1 when it leaves at the top
        var t = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        // small drift only: the image has a few % of slack above and fades out at the bottom
        p.img.style.setProperty("--shift", (t * Math.min(r.height, window.innerHeight) * 0.04).toFixed(1) + "px");
      });

      timelines.forEach(function (tl) {
        var r = tl.getBoundingClientRect();
        var line = vh * 0.6;
        var tp = Math.max(0, Math.min(1, (line - r.top) / Math.max(r.height, 1)));
        tl.style.setProperty("--tp", tp.toFixed(3));
        tl.querySelectorAll("li").forEach(function (li) {
          li.classList.toggle("is-passed", li.getBoundingClientRect().top + 10 < line);
        });
      });
    }
  }
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
  onScroll();

  /* ---- hero: background video, spotlight, decoding name ---- */
  if (hero) {
    var video = hero.querySelector(".hero__video");
    var saveData = navigator.connection && navigator.connection.saveData;
    if (video) {
      if (!motionOK || saveData || window.matchMedia("(max-width: 767px)").matches) {
        video.remove(); // the poster stays as the CSS background of .hero__media
      } else {
        video.addEventListener("error", function () { video.remove(); }, true);
        video.addEventListener("playing", function () { video.classList.add("is-playing"); });
        var source = document.createElement("source");
        source.src = video.getAttribute("data-src");
        source.type = "video/mp4";
        source.addEventListener("error", function () { video.remove(); });
        video.appendChild(source);
        new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!video.isConnected) return;
            if (entry.isIntersecting) {
              if (video.preload === "none") {
                video.preload = "auto";
                video.load();
              }
              var p = video.play();
              if (p && p.catch) p.catch(function () {});
            } else {
              video.pause();
            }
          });
        }).observe(hero);
      }
    }

    if (motionOK && finePointer) {
      var art = hero.querySelector(".hero__art");
      var raf = 0;
      var last = null;
      hero.addEventListener("pointermove", function (e) {
        last = e;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var r = hero.getBoundingClientRect();
          var x = last.clientX - r.left;
          var y = last.clientY - r.top;
          hero.style.setProperty("--mx", x + "px");
          hero.style.setProperty("--my", y + "px");
          hero.classList.add("is-lit");
          if (art && art.isConnected) {
            art.style.setProperty("--px", ((x / r.width - 0.5) * -18).toFixed(1) + "px");
            art.style.setProperty("--py", ((y / r.height - 0.5) * -12).toFixed(1) + "px");
          }
        });
      });
      hero.addEventListener("pointerleave", function () {
        hero.classList.remove("is-lit");
      });
    }

    /* Scramble Text (21st, @kevingirelli): characters settle in a loose sweep from the left.
       The real text keeps its place in the layout; the noise is drawn in an overlay. */
    if (motionOK) {
      hero.querySelectorAll("[data-scramble]").forEach(function (el) {
        var text = el.textContent;
        var glyphs = Array.from(text);
        var noise = "01<>[]{}/\\|=~^#%&ABCDEFXZ";
        var gap = 55;
        var times = glyphs.map(function (_, i) {
          var scatter = Math.sin(i * 7.31 + glyphs.length * 1.7) * 0.5 + 0.5;
          return (i + scatter * 2.5) * gap;
        });
        var end = Math.max.apply(null, times);
        var out = document.createElement("span");
        out.className = "scramble__out";
        out.setAttribute("aria-hidden", "true");
        var real = document.createElement("span");
        real.textContent = text;
        real.style.visibility = "hidden";
        el.textContent = "";
        el.appendChild(real);
        el.appendChild(out);
        var start = performance.now() + 350;
        var written = -Infinity;
        var tick = function (now) {
          var elapsed = now - start;
          if (elapsed >= end) {
            real.style.visibility = "";
            out.remove();
            return;
          }
          if (now - written >= 45) {
            written = now;
            out.textContent = glyphs.map(function (g, i) {
              return /\s/.test(g) || elapsed >= times[i] ? g : noise[Math.floor(Math.random() * noise.length)];
            }).join("");
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }
  }

  if (!motionOK || !finePointer) return;

  /* ---- magnetic buttons (after the 21st Magnetic Button, @mohammadshehadeh) ---- */
  document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
    var inner = btn.querySelector("span");
    btn.addEventListener("pointermove", function (e) {
      var r = btn.getBoundingClientRect();
      var x = e.clientX - (r.left + r.width / 2);
      var y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = "translate(" + (x * 0.28).toFixed(1) + "px," + (y * 0.4).toFixed(1) + "px)";
      if (inner) inner.style.transform = "translate(" + (x * 0.12).toFixed(1) + "px," + (y * 0.16).toFixed(1) + "px)";
    });
    btn.addEventListener("pointerleave", function () {
      btn.style.transform = "";
      if (inner) inner.style.transform = "";
    });
  });

  /* ---- tilt cards with pointer sheen (after the 21st Tilt Card, @tom_ui) ---- */
  document.querySelectorAll("[data-tilt]").forEach(function (card) {
    var limit = card.hasAttribute("data-tilt-soft") ? 5 : 10;
    var target = card.querySelector(".cert__img") || card;
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      card.classList.add("is-tilting");
      card.style.setProperty("--rx", ((0.5 - py) * limit * 2).toFixed(2) + "deg");
      card.style.setProperty("--ry", ((px - 0.5) * limit * 2).toFixed(2) + "deg");
      var tr = target.getBoundingClientRect();
      target.style.setProperty("--sx", ((e.clientX - tr.left) / tr.width * 100).toFixed(1) + "%");
      target.style.setProperty("--sy", ((e.clientY - tr.top) / tr.height * 100).toFixed(1) + "%");
    });
    card.addEventListener("pointerleave", function () {
      card.classList.remove("is-tilting");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });

  /* book cards on books.html get the same sheen, without the tilt */
  document.addEventListener("pointermove", function (e) {
    var card = e.target.closest && e.target.closest(".book-card");
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty("--sx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
    card.style.setProperty("--sy", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
  }, { passive: true });
})();
