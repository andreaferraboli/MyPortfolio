/*
Copyright (c) 2017 Niklas Knaack

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

!(function () {
  window.SVG3DTagCloud = function (t, e) {
    var i = {
      entries: [],
      width: 480,
      height: 480,
      radius: "70%",
      radiusMin: 75,
      bgDraw: !0,
      bgColor: "#000",
      opacityOver: 1,
      opacityOut: 0.05,
      opacitySpeed: 6,
      fov: 800,
      speed: 2,
      fontFamily: "Arial, sans-serif",
      fontSize: "15",
      fontColor: "#fff",
      fontWeight: "normal",
      fontStyle: "normal",
      fontStretch: "normal",
      fontToUpperCase: !1,
      tooltipFontFamily: "Arial, sans-serif",
      tooltipFontSize: "15",
      tooltipFontColor: "#fff",
      tooltipFontWeight: "normal",
      tooltipFontStyle: "normal",
      tooltipFontStretch: "normal",
      tooltipFontToUpperCase: !1,
      tooltipTextAnchor: "left",
      tooltipDiffX: 0,
      tooltipDiffY: 10,
      animatingSpeed: 0.01,
      animatingRadiusLimit: 1.3,
    };
    if (void 0 !== e)
      for (var o in e)
        e.hasOwnProperty(o) && i.hasOwnProperty(o) && (i[o] = e[o]);
    if (!i.entries.length) return !1;
    var n,
      r,
      a,
      s,
      l,
      u,
      c,
      d = [],
      m = !0,
      f = { x: 0, y: 0 },
      p = { x: 0, y: 0, z: 0 },
      h = { x: 0, y: 0 },
      v = { sx: 0, cx: 0, sy: 0, cy: 0 },
      y = Math.PI / 180,
      g = "http://www.w3.org/2000/svg",
      w = 1;
    function A() {
      window.cancelAnimFrame(c),
        window.removeEventListener("resize", M),
        u && l.removeChild(u),
        l &&
          (t.removeChild(l), l.removeEventListener("mousemove", D), delete l);
    }
    function b() {
      (l = document.createElementNS(g, "svg")).addEventListener("mousemove", D),
        t.appendChild(l),
        i.bgDraw &&
          ((u = document.createElementNS(g, "rect")).setAttribute("x", 0),
          u.setAttribute("y", 0),
          u.setAttribute("fill", i.bgColor),
          l.appendChild(u)),
        (function () {
          for (var t = !1, e = 1, o = i.entries.length + 1; e < o; e++) {
            var r = Math.acos((2 * e) / o - 1),
              a = Math.sqrt(o * Math.PI) * r,
              s = Math.cos(a) * Math.sin(r),
              u = Math.sin(a) * Math.sin(r),
              c = Math.cos(r),
              m = F(e - 1, i.entries[e - 1], s, u, c);
            d.push(m), void 0 !== i.entries[e - 1].tooltip && (t = !0);
          }
          t &&
            ((n = document.createElementNS(g, "text")).setAttribute("x", 0),
            n.setAttribute("y", 0),
            n.setAttribute("fill", i.tooltipFontColor),
            n.setAttribute("font-family", i.tooltipFontFamily),
            n.setAttribute("font-size", i.tooltipFontSize),
            n.setAttribute("font-weight", i.tooltipFontWeight),
            n.setAttribute("font-style", i.tooltipFontStyle),
            n.setAttribute("font-stretch", i.tooltipFontStretch),
            n.setAttribute("text-anchor", i.tooltipTextAnchor),
            (n.textContent = ""),
            l.appendChild(n));
        })(),
        x(),
        C(),
        window.addEventListener("resize", M);
    }
    function x() {
      var e =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth,
        o =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight,
        n = e,
        c = o;
      i.width.toString().indexOf("%") > 0 ||
      i.height.toString().indexOf("%") > 0
        ? ((n = Math.round((t.offsetWidth / 100) * parseInt(i.width))),
          (c = Math.round((n / 100) * parseInt(i.height))))
        : ((n = parseInt(i.width)), (c = parseInt(i.height))),
        e <= n && (n = e),
        o <= c && (c = o),
        (s = { x: n / 2, y: c / 2 }),
        (h.x = i.speed / s.x),
        (h.y = i.speed / s.y),
        (a =
          n >= c
            ? (c / 100) * parseInt(i.radius)
            : (n / 100) * parseInt(i.radius)) < 1 && (a = 1),
        (r = a / 2) < i.radiusMin && ((r = i.radiusMin), (a = 2 * r)),
        l.setAttribute("width", n),
        l.setAttribute("height", c),
        i.bgDraw && (u.setAttribute("width", n), u.setAttribute("height", c)),
        (function (t) {
          for (var e = 0, i = d.length; e < i; e++)
            (o = d[e]),
              (n = t),
              void 0,
              void 0,
              void 0,
              void 0,
              (r = o.vectorPosition.x - p.x),
              (a = o.vectorPosition.y - p.y),
              (s = o.vectorPosition.z - p.z),
              (l = Math.sqrt(r * r + a * a + s * s)),
              (o.vectorPosition.x /= l),
              (o.vectorPosition.y /= l),
              (o.vectorPosition.z /= l),
              (o.vectorPosition.x *= n),
              (o.vectorPosition.y *= n),
              (o.vectorPosition.z *= n);
          var o, n, r, a, s, l;
        })(r * w);
    }
    function F(t, e, o, n, r) {
      var a = {};
      return (
        void 0 !== e.label
          ? ((a.element = document.createElementNS(g, "text")),
            a.element.setAttribute("x", 0),
            a.element.setAttribute("y", 0),
            a.element.setAttribute("fill", i.fontColor),
            a.element.setAttribute("font-family", i.fontFamily),
            a.element.setAttribute(
              "font-size",
              e.fontSize ? e.fontSize : i.fontSize
            ),
            a.element.setAttribute("font-weight", i.fontWeight),
            a.element.setAttribute("font-style", i.fontStyle),
            a.element.setAttribute("font-stretch", i.fontStretch),
            a.element.setAttribute("text-anchor", "middle"),
            (a.element.textContent = i.fontToUpperCase
              ? e.label.toUpperCase()
              : e.label))
          : void 0 !== e.image &&
            ((a.element = document.createElementNS(g, "image")),
            a.element.setAttribute("x", 0),
            a.element.setAttribute("y", 0),
            a.element.setAttribute("width", e.width),
            a.element.setAttribute("height", e.height),
            a.element.setAttribute("id", "image_" + t),
            a.element.setAttributeNS(
              "http://www.w3.org/1999/xlink",
              "href",
              e.image
            ),
            (a.diffX = e.width / 2),
            (a.diffY = e.height / 2)),
        (a.link = document.createElementNS(g, "a")),
        a.link.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          e.url
        ),
        a.link.setAttribute("target", e.target),
        a.link.addEventListener("mouseover", P, !0),
        a.link.addEventListener("mouseout", z, !0),
        a.link.appendChild(a.element),
        void 0 !== e.tooltip
          ? ((a.tooltip = !0),
            (a.tooltipLabel = i.tooltipFontToUpperCase
              ? e.tooltip.toUpperCase()
              : e.tooltip))
          : (a.tooltip = !1),
        (a.index = t),
        (a.mouseOver = !1),
        (a.vectorPosition = { x: o, y: n, z: r }),
        (a.vector2D = { x: 0, y: 0 }),
        l.appendChild(a.link),
        a
      );
    }
    function S(t) {
      for (var e = 0, i = d.length; e < i; e++) {
        var o = d[e];
        if (
          o.element.getAttribute("x") === t.getAttribute("x") &&
          o.element.getAttribute("y") === t.getAttribute("y")
        )
          return o;
      }
    }
    function C() {
      (c = requestAnimFrame(C)),
        (function () {
          var t = h.x * f.x - i.speed,
            e = i.speed - h.y * f.y,
            o = t * y,
            n = e * y;
          (v.sx = Math.sin(o)),
            (v.cx = Math.cos(o)),
            (v.sy = Math.sin(n)),
            (v.cy = Math.cos(n));
          for (var l = 0, u = d.length; l < u; l++) {
            var c = d[l];
            if (m) {
              var p = c.vectorPosition.x,
                g = c.vectorPosition.y * v.sy + c.vectorPosition.z * v.cy;
              (c.vectorPosition.x = p * v.cx + g * v.sx),
                (c.vectorPosition.y =
                  c.vectorPosition.y * v.cy + c.vectorPosition.z * -v.sy),
                (c.vectorPosition.z = p * -v.sx + g * v.cx);
            }
            var A,
              b = i.fov / (i.fov + c.vectorPosition.z);
            (c.vector2D.x = c.vectorPosition.x * b + s.x),
              (c.vector2D.y = c.vectorPosition.y * b + s.y),
              c.diffX &&
                c.diffY &&
                ((c.vector2D.x -= c.diffX), (c.vector2D.y -= c.diffY)),
              c.element.setAttribute("x", c.vector2D.x),
              c.element.setAttribute("y", c.vector2D.y),
              m
                ? (A = (r - c.vectorPosition.z) / a) < i.opacityOut &&
                  (A = i.opacityOut)
                : ((A = parseFloat(c.element.getAttribute("opacity"))),
                  c.mouseOver
                    ? (A += (i.opacityOver - A) / i.opacitySpeed)
                    : (A += (i.opacityOut - A) / i.opacitySpeed)),
              c.element.setAttribute(
                "opacity",
                A * (1 - (w - 1) / (i.animatingRadiusLimit - 1))
              );
          }
          d = d.sort(function (t, e) {
            return e.vectorPosition.z - t.vectorPosition.z;
          });
        })();
    }
    function P(t) {
      m = !1;
      var e,
        o = S(t.target);
      !(function (t) {
        for (var e = 0, i = d.length; e < i; e++) {
          var o = d[e];
          o.index === t.index ? (o.mouseOver = !0) : (o.mouseOver = !1);
        }
      })(o),
        o.tooltip &&
          (e = o).tooltip &&
          (n.setAttribute("x", e.vector2D.x - i.tooltipDiffX),
          n.setAttribute("y", e.vector2D.y - i.tooltipDiffY),
          (n.textContent = i.tooltipFontToUpperCase
            ? e.tooltipLabel.toUpperCase()
            : e.tooltipLabel),
          n.setAttribute("opacity", 1));
    }
    function z(t) {
      m = !0;
      var e = S(t.target);
      e.tooltip && n.setAttribute("opacity", 0);
    }
    function D(t) {
      var e, i;
      (e = t),
        (i = l.getBoundingClientRect()),
        (f = { x: e.clientX - i.left, y: e.clientY - i.top });
    }
    function M(t) {
      x();
    }
    function T(t) {
      (w = Math.min(Math.max(t, 1), i.animatingRadiusLimit)), x();
    }
    (window.requestAnimFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (t) {
        return window.setTimeout(t, 1e3 / 60);
      }),
      (window.cancelAnimFrame = window.requestAnimationFrame
        ? window.cancelAnimationFrame
        : window.webkitRequestAnimationFrame
        ? window.webkitCancelAnimationFrame
        : window.mozRequestAnimationFrame
        ? window.mozCancelAnimationFrame
        : window.clearTimeout);
    var E = !1,
      O = !1,
      L = !1;
    function k() {
      (L = w < i.animatingRadiusLimit)
        ? (T(w + i.animatingSpeed), requestAnimFrame(k))
        : "function" == typeof E && (E(), (E = !1));
    }
    function q() {
      (L = w > 1)
        ? (T(w - i.animatingSpeed), requestAnimFrame(q))
        : "function" == typeof O && (O(), (O = !1));
    }
    b(),
      (this.destroy = A),
      (this.animOut = function (t) {
        L || ((w = 1), (E = t), k());
      }),
      (this.animIn = function (t) {
        L || ((w = i.animatingRadiusLimit), (O = t), q());
      }),
      (this.setEntries = function (t) {
        A(), (i.entries = t), b();
      });
  };
})(),
  "undefined" != typeof jQuery &&
    (function (t) {
      t.fn.svg3DTagCloud = function (e) {
        var i = arguments;
        return this.each(function () {
          if (t.data(this, "plugin_SVG3DTagCloud")) {
            var o = t.data(this, "plugin_SVG3DTagCloud");
            o[e]
              ? o[e].apply(this, Array.prototype.slice.call(i, 1))
              : t.error(
                  "Method " + e + " does not exist on jQuery.svg3DTagCloud"
                );
          } else t.data(this, "plugin_SVG3DTagCloud", new SVG3DTagCloud(this, e));
        });
      };
    })(jQuery);
