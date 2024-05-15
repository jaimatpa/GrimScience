import { presetUno as D, presetIcons as S, transformerVariantGroup as A, transformerDirectives as F } from "unocss";
var P = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) }, d = function(e) {
  return typeof e == "string" ? e.length > 0 : typeof e == "number";
}, s = function(e, t, r) {
  return t === void 0 && (t = 0), r === void 0 && (r = Math.pow(10, t)), Math.round(r * e) / r + 0;
}, f = function(e, t, r) {
  return t === void 0 && (t = 0), r === void 0 && (r = 1), e > r ? r : e > t ? e : t;
}, I = function(e) {
  return (e = isFinite(e) ? e % 360 : 0) > 0 ? e : e + 360;
}, y = function(e) {
  return { r: f(e.r, 0, 255), g: f(e.g, 0, 255), b: f(e.b, 0, 255), a: f(e.a) };
}, p = function(e) {
  return { r: s(e.r), g: s(e.g), b: s(e.b), a: s(e.a, 3) };
}, R = /^#([0-9a-f]{3,8})$/i, g = function(e) {
  var t = e.toString(16);
  return t.length < 2 ? "0" + t : t;
}, M = function(e) {
  var t = e.r, r = e.g, n = e.b, i = e.a, a = Math.max(t, r, n), o = a - Math.min(t, r, n), u = o ? a === t ? (r - n) / o : a === r ? 2 + (n - t) / o : 4 + (t - r) / o : 0;
  return { h: 60 * (u < 0 ? u + 6 : u), s: a ? o / a * 100 : 0, v: a / 255 * 100, a: i };
}, z = function(e) {
  var t = e.h, r = e.s, n = e.v, i = e.a;
  t = t / 360 * 6, r /= 100, n /= 100;
  var a = Math.floor(t), o = n * (1 - r), u = n * (1 - (t - a) * r), l = n * (1 - (1 - t + a) * r), h = a % 6;
  return { r: 255 * [n, u, o, o, l, n][h], g: 255 * [l, n, n, u, o, o][h], b: 255 * [o, o, l, n, n, u][h], a: i };
}, x = function(e) {
  return { h: I(e.h), s: f(e.s, 0, 100), l: f(e.l, 0, 100), a: f(e.a) };
}, $ = function(e) {
  return { h: s(e.h), s: s(e.s), l: s(e.l), a: s(e.a, 3) };
}, w = function(e) {
  return z((r = (t = e).s, { h: t.h, s: (r *= ((n = t.l) < 50 ? n : 100 - n) / 100) > 0 ? 2 * r / (n + r) * 100 : 0, v: n + r, a: t.a }));
  var t, r, n;
}, b = function(e) {
  return { h: (t = M(e)).h, s: (i = (200 - (r = t.s)) * (n = t.v) / 100) > 0 && i < 200 ? r * n / 100 / (i <= 100 ? i : 200 - i) * 100 : 0, l: i / 2, a: t.a };
  var t, r, n, i;
}, V = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, q = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, C = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, E = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, N = { string: [[function(e) {
  var t = R.exec(e);
  return t ? (e = t[1]).length <= 4 ? { r: parseInt(e[0] + e[0], 16), g: parseInt(e[1] + e[1], 16), b: parseInt(e[2] + e[2], 16), a: e.length === 4 ? s(parseInt(e[3] + e[3], 16) / 255, 2) : 1 } : e.length === 6 || e.length === 8 ? { r: parseInt(e.substr(0, 2), 16), g: parseInt(e.substr(2, 2), 16), b: parseInt(e.substr(4, 2), 16), a: e.length === 8 ? s(parseInt(e.substr(6, 2), 16) / 255, 2) : 1 } : null : null;
}, "hex"], [function(e) {
  var t = C.exec(e) || E.exec(e);
  return t ? t[2] !== t[4] || t[4] !== t[6] ? null : y({ r: Number(t[1]) / (t[2] ? 100 / 255 : 1), g: Number(t[3]) / (t[4] ? 100 / 255 : 1), b: Number(t[5]) / (t[6] ? 100 / 255 : 1), a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1) }) : null;
}, "rgb"], [function(e) {
  var t = V.exec(e) || q.exec(e);
  if (!t)
    return null;
  var r, n, i = x({ h: (r = t[1], n = t[2], n === void 0 && (n = "deg"), Number(r) * (P[n] || 1)), s: Number(t[3]), l: Number(t[4]), a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1) });
  return w(i);
}, "hsl"]], object: [[function(e) {
  var t = e.r, r = e.g, n = e.b, i = e.a, a = i === void 0 ? 1 : i;
  return d(t) && d(r) && d(n) ? y({ r: Number(t), g: Number(r), b: Number(n), a: Number(a) }) : null;
}, "rgb"], [function(e) {
  var t = e.h, r = e.s, n = e.l, i = e.a, a = i === void 0 ? 1 : i;
  if (!d(t) || !d(r) || !d(n))
    return null;
  var o = x({ h: Number(t), s: Number(r), l: Number(n), a: Number(a) });
  return w(o);
}, "hsl"], [function(e) {
  var t = e.h, r = e.s, n = e.v, i = e.a, a = i === void 0 ? 1 : i;
  if (!d(t) || !d(r) || !d(n))
    return null;
  var o = function(u) {
    return { h: I(u.h), s: f(u.s, 0, 100), v: f(u.v, 0, 100), a: f(u.a) };
  }({ h: Number(t), s: Number(r), v: Number(n), a: Number(a) });
  return z(o);
}, "hsv"]] }, k = function(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r][0](e);
    if (n)
      return [n, t[r][1]];
  }
  return [null, void 0];
}, G = function(e) {
  return typeof e == "string" ? k(e.trim(), N.string) : typeof e == "object" && e !== null ? k(e, N.object) : [null, void 0];
}, v = function(e, t) {
  var r = b(e);
  return { h: r.h, s: f(r.s + 100 * t, 0, 100), l: r.l, a: r.a };
}, m = function(e) {
  return (299 * e.r + 587 * e.g + 114 * e.b) / 1e3 / 255;
}, j = function(e, t) {
  var r = b(e);
  return { h: r.h, s: r.s, l: f(r.l + 100 * t, 0, 100), a: r.a };
}, H = function() {
  function e(t) {
    this.parsed = G(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }
  return e.prototype.isValid = function() {
    return this.parsed !== null;
  }, e.prototype.brightness = function() {
    return s(m(this.rgba), 2);
  }, e.prototype.isDark = function() {
    return m(this.rgba) < 0.5;
  }, e.prototype.isLight = function() {
    return m(this.rgba) >= 0.5;
  }, e.prototype.toHex = function() {
    return t = p(this.rgba), r = t.r, n = t.g, i = t.b, o = (a = t.a) < 1 ? g(s(255 * a)) : "", "#" + g(r) + g(n) + g(i) + o;
    var t, r, n, i, a, o;
  }, e.prototype.toRgb = function() {
    return p(this.rgba);
  }, e.prototype.toRgbString = function() {
    return t = p(this.rgba), r = t.r, n = t.g, i = t.b, (a = t.a) < 1 ? "rgba(" + r + ", " + n + ", " + i + ", " + a + ")" : "rgb(" + r + ", " + n + ", " + i + ")";
    var t, r, n, i, a;
  }, e.prototype.toHsl = function() {
    return $(b(this.rgba));
  }, e.prototype.toHslString = function() {
    return t = $(b(this.rgba)), r = t.h, n = t.s, i = t.l, (a = t.a) < 1 ? "hsla(" + r + ", " + n + "%, " + i + "%, " + a + ")" : "hsl(" + r + ", " + n + "%, " + i + "%)";
    var t, r, n, i, a;
  }, e.prototype.toHsv = function() {
    return t = M(this.rgba), { h: s(t.h), s: s(t.s), v: s(t.v), a: s(t.a, 3) };
    var t;
  }, e.prototype.invert = function() {
    return c({ r: 255 - (t = this.rgba).r, g: 255 - t.g, b: 255 - t.b, a: t.a });
    var t;
  }, e.prototype.saturate = function(t) {
    return t === void 0 && (t = 0.1), c(v(this.rgba, t));
  }, e.prototype.desaturate = function(t) {
    return t === void 0 && (t = 0.1), c(v(this.rgba, -t));
  }, e.prototype.grayscale = function() {
    return c(v(this.rgba, -1));
  }, e.prototype.lighten = function(t) {
    return t === void 0 && (t = 0.1), c(j(this.rgba, t));
  }, e.prototype.darken = function(t) {
    return t === void 0 && (t = 0.1), c(j(this.rgba, -t));
  }, e.prototype.rotate = function(t) {
    return t === void 0 && (t = 15), this.hue(this.hue() + t);
  }, e.prototype.alpha = function(t) {
    return typeof t == "number" ? c({ r: (r = this.rgba).r, g: r.g, b: r.b, a: t }) : s(this.rgba.a, 3);
    var r;
  }, e.prototype.hue = function(t) {
    var r = b(this.rgba);
    return typeof t == "number" ? c({ h: t, s: r.s, l: r.l, a: r.a }) : s(r.h);
  }, e.prototype.isEqual = function(t) {
    return this.toHex() === c(t).toHex();
  }, e;
}(), c = function(e) {
  return e instanceof H ? e : new H(e);
};
const L = {
  colors: {
    white: "#ffffff",
    black: "#0b1015",
    // gray
    "gray-900": "#1d2935",
    "gray-800": "#2c3e50",
    "gray-700": "#3e5770",
    "gray-600": "#4f6f7f",
    "gray-500": "#809fae",
    "gray-400": "#93b0be",
    "gray-300": "#b6c6ce",
    "gray-200": "#c8d3d9",
    "gray-100": "#e0e5e7",
    // primary
    "primary-900": "#034124",
    "primary-800": "#085e37",
    "primary-700": "#13794a",
    "primary-600": "#299f69",
    "primary-500": "#42b983",
    "primary-400": "#56cd96",
    "primary-300": "#89deb7",
    "primary-200": "#abeacd",
    "primary-100": "#e0f8ed",
    // accent
    "accent-900": "#350066",
    "accent-800": "#4f0098",
    "accent-700": "#6806c1",
    "accent-600": "#8929e3",
    "accent-500": "#a44cf6",
    "accent-400": "#b96dff",
    "accent-300": "#c88eff",
    "accent-200": "#d7adff",
    "accent-100": "#e6ccff",
    // danger
    "danger-900": "#500000",
    "danger-800": "#850505",
    "danger-700": "#ac0d0d",
    "danger-600": "#cd1b1b",
    "danger-500": "#e83030",
    "danger-400": "#f44747",
    "danger-300": "#ff6565",
    "danger-200": "#ff9494",
    "danger-100": "#ffcaca",
    // warning
    "warning-900": "#702200",
    "warning-800": "#943800",
    "warning-700": "#b54d01",
    "warning-600": "#c85900",
    "warning-500": "#ea6e00",
    "warning-400": "#ff8915",
    "warning-300": "#ffa733",
    "warning-200": "#ffc45e",
    "warning-100": "#ffe6b0",
    // info
    "info-900": "#004576",
    "info-800": "#006294",
    "info-700": "#007db1",
    "info-600": "#0098c4",
    "info-500": "#03c2e6",
    "info-400": "#74e0ed",
    "info-300": "#9ae6ef",
    "info-200": "#bceef1",
    "info-100": "#e3f5f6"
  }
}, O = {
  colors: Object.entries(L.colors).reduce((e, [t, r]) => (e[t] = r, e[`${t}-lighter`] = c(r).lighten(0.025).toHex(), e[`${t}-darker`] = c(r).darken(0.08).toHex(), e), {}),
  fontFamily: {
    sans: "Avenir, Helvetica, Arial, sans-serif"
  }
}, W = {
  presets: [
    D(),
    S({
      prefix: ["i-"],
      scale: 1.2,
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle"
      }
    })
  ],
  transformers: [A(), F()],
  theme: O,
  variants: [
    (e) => {
      const t = "not-action:";
      return e.startsWith(t) ? {
        matcher: e.slice(t.length),
        selector: (r) => `${r}:not(:hover):not(:focus):not(:active)`
      } : e;
    }
  ],
  shortcuts: {
    // utilities
    "$ui-fcc": "flex justify-center items-center",
    "$ui-fbc": "flex justify-between items-center",
    "$ui-fsc": "flex justify-start items-center",
    "$ui-if-sc": "inline-flex justify-start items-center",
    "$ui-fec": "flex justify-end items-center",
    "$ui-inline-fcc": "inline-flex justify-center items-center",
    "$ui-z-max": "z-2147483646",
    "$ui-z-max-override": "z-2147483647",
    // general
    "$ui-bg-base": "bg-white dark:bg-black",
    "$ui-base": "box-border font-inherit",
    "$ui-transition": "transition-all duration-300 ease-in-out",
    "$ui-borderless": "!border-transparent !shadow-none",
    "$ui-base-br": "rounded-3px",
    "$ui-border-base": "border-gray/20",
    "$ui-text": "text-black dark:text-white",
    "$ui-glass-effect": "backdrop-blur-6 bg-white/80 dark:bg-black/90"
  },
  rules: [
    ["$ui-font-inherit", { "font-family": "inherit" }],
    [
      // the animation of dark toggle button
      /^\$ui-dark-toggle-vtr$/,
      () => `
          ::view-transition-old(root),
          ::view-transition-new(root) {
            animation: none;
            mix-blend-mode: normal;
          }

          ::view-transition-old(root),
          .dark::view-transition-new(root) {
            z-index: 1;
          }

          ::view-transition-new(root),
          .dark::view-transition-old(root) {
            z-index: 9999;
          }
        `
    ]
  ]
};
export {
  O as theme,
  L as themeDef,
  W as unoConfig
};
