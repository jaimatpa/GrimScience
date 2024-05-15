// @unocss-include

import { Dropdown as xe, VClosePopper as _e, Tooltip as ze } from "floating-vue";
import { VTooltip as Vo } from "floating-vue";
import { openBlock as p, createElementBlock as _, createElementVNode as b, defineComponent as T, useAttrs as je, computed as $, useSlots as Ce, createBlock as O, resolveDynamicComponent as Ve, mergeProps as q, withCtx as y, renderSlot as w, unref as k, createCommentVNode as A, normalizeClass as V, ref as B, watch as R, customRef as Se, isRef as Q, getCurrentScope as Ie, onScopeDispose as He, toRef as Je, readonly as Be, onMounted as Y, nextTick as Z, getCurrentInstance as de, shallowRef as Ue, watchEffect as X, createVNode as W, Transition as ce, normalizeStyle as fe, toDisplayString as I, h as Ke, render as be, normalizeProps as pe, guardReactiveProps as me, Teleport as Te, createTextVNode as H, withDirectives as ve, vModelDynamic as Ge, provide as Ye, createSlots as De, inject as Xe, Fragment as ye, renderList as we, withModifiers as qe } from "vue";
const ge = (e, o) => {
  const t = e.__vccOpts || e;
  for (const [a, n] of o)
    t[a] = n;
  return t;
}, Qe = {}, Ze = { class: "h-3 w-3 $ui-inline-fcc" }, et = /* @__PURE__ */ b("svg", {
  class: "animate-spin",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
}, [
  /* @__PURE__ */ b("circle", {
    class: "opacity-25",
    cx: "12",
    cy: "12",
    r: "10",
    stroke: "currentColor",
    "stroke-width": "4"
  }),
  /* @__PURE__ */ b("path", {
    class: "opacity-75",
    fill: "currentColor",
    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  })
], -1), tt = [
  et
];
function ot(e, o) {
  return p(), _("div", Ze, tt);
}
const Me = /* @__PURE__ */ ge(Qe, [["render", ot]]), nt = { key: 2 }, G = /* @__PURE__ */ T({
  inheritAttrs: !1,
  __name: "Button",
  props: {
    type: { default: "default" },
    round: { type: [String, Boolean], default: "normal" },
    loading: { type: Boolean, default: !1 },
    disabled: { type: Boolean, default: !1 },
    size: { default: "normal" },
    flat: { type: Boolean, default: !1 },
    outlined: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: o }) {
    const t = e, a = o, n = je(), l = $(() => n.to ? "router-link" : n.href ? "a" : "button"), r = $(() => t.loading || t.disabled);
    function s(u) {
      if (r.value) {
        u.preventDefault(), u.stopPropagation(), u.stopImmediatePropagation();
        return;
      }
      a("click", u);
    }
    const i = {
      common: {
        default: "active:bg-primary-100-darker dark:active:bg-gray-800-darker",
        primary: "active:bg-primary-500-darker",
        accent: "active:bg-accent-500-darker",
        danger: "active:bg-danger-500-darker",
        warning: "active:bg-warning-500-darker",
        info: "active:bg-primary-100-darker dark:active:bg-gray-800-darker",
        success: "active:bg-primary-100-darker dark:active:bg-gray-800-darker"
      },
      normal: {
        default: "bg-primary-100 hover:bg-primary-100-lighter dark:bg-gray-800 dark:hover:bg-gray-800-lighter dark:hover:text-white",
        primary: " text-white bg-primary-500 hover:bg-primary-500-lighter dark:hover:bg-primary-500-darker",
        accent: "text-white bg-accent-500 hover:bg-accent-500-lighter dark:bg-accent-500-darker dark:bg-accent-300",
        danger: "text-white bg-danger-500 hover:bg-danger-500-lighter dark:hover:bg-danger-500-darker",
        warning: "text-white bg-warning-500 hover:bg-warning-500-lighter dark:hover:bg-warning-500-darker",
        info: "text-info-500 bg-primary-100 hover:bg-primary-100-lighter dark:bg-gray-800 dark:hover:bg-gray-800-lighter",
        success: "text-primary-500 bg-primary-100 hover:bg-primary-100-lighter dark:bg-gray-800 dark:hover:bg-gray-800-lighter"
      },
      flat: {
        default: "hover:bg-primary-100 hover:text-black !dark:text-white dark:hover:bg-primary-800",
        primary: "hover:bg-primary-500 hover:text-white",
        accent: "hover:bg-accent-500 hover:text-white",
        danger: "hover:bg-danger-500 hover:text-white",
        warning: "hover:bg-warning-500 hover:text-white",
        info: "hover:bg-primary-100 hover:text-info-500 dark:hover:bg-gray-800 dark:hover:text-info-400",
        success: "hover:bg-primary-100 hover:text-primary-500 dark:hover:bg-primary-800 dark:hover:text-primary-400"
      },
      outlined: {
        default: "hover:border-primary-100 hover:text-primary-300 hover:active:ring-primary-100:5 hover:active:bg-primary-100:5",
        primary: "hover:border-primary-500 hover:text-primary-500 active:ring-primary-500:5 active:bg-primary-500:5",
        accent: "hover:border-accent-500 hover:text-accent-500 active:ring-accent-500:5 active:bg-accent-500:5",
        danger: "hover:border-danger-500 hover:text-danger-500 active:ring-danger-500:5 active:bg-danger-500:5",
        warning: "hover:border-warning-500 hover:text-warning-500 active:ring-warning-500:5 active:bg-warning-500:5",
        info: "hover:border-info-500 hover:text-info-500 active:ring-info-500:5 active:bg-info-500:5",
        success: "hover:border-primary-500 hover:text-primary-500 active:ring-primary-500:5 active:bg-primary-500:5"
      }
    }, c = Ce(), d = $(() => t.flat ? i.flat[t.type] : t.outlined ? i.outlined[t.type] : i.normal[t.type]);
    return (u, f) => (p(), O(Ve(l.value), q(u.$attrs, {
      role: "button",
      "aria-disabled": r.value,
      class: ["$ui-base $ui-inline-fcc inline-flex cursor-pointer select-none gap1.25 py-0 no-underline $ui-transition", [
        [i.common[t.type]],
        {
          "rounded-full": t.round === "full",
          "$ui-base-br": t.round === "normal",
          "opacity-50 cursor-not-allowed": r.value,
          "bg-transparent": t.flat || t.outlined
        },
        [
          u.outlined ? "b-1 $ui-border-base active:ring-3 shadow-sm" : "border-none",
          u.size === "mini" ? "px1 text-3 h5.5" : "px3.5 text-3.5 h8",
          d.value
        ]
      ]],
      onClickCapture: s
    }), {
      default: y(() => [
        u.loading ? (p(), O(Me, {
          key: 0,
          class: "mt0.5 h-full w3"
        })) : w(u.$slots, "icon", {
          key: 1,
          class: "h-full w3 $ui-inline-fcc"
        }),
        k(c).default ? (p(), _("div", nt, [
          w(u.$slots, "default")
        ])) : A("", !0),
        w(u.$slots, "icon-right")
      ]),
      _: 3
    }, 16, ["aria-disabled", "class"]));
  }
}), rt = {}, at = { class: "mx-0.5 $ui-base inline-block select-none whitespace-nowrap rounded px-1.5 py-0.5 text-xs" };
function lt(e, o) {
  return p(), _("span", at, [
    w(e.$slots, "default")
  ]);
}
const co = /* @__PURE__ */ ge(rt, [["render", lt]]), ue = /* @__PURE__ */ T({
  __name: "Icon",
  props: {
    icon: {},
    inline: { type: Boolean },
    action: { type: Boolean, default: !1 }
  },
  setup(e) {
    return (o, t) => (p(), O(Ve(o.inline ? "span" : "div"), {
      class: V(["$ui-base", [o.icon, o.action ? "cursor-pointer hover:op50" : ""]])
    }, null, 8, ["class"]));
  }
});
function le(e) {
  return Ie() ? (He(e), !0) : !1;
}
function st(e, o, { enumerable: t = !1, unwrap: a = !0 } = {}) {
  for (const [n, l] of Object.entries(o))
    n !== "value" && (Q(l) && a ? Object.defineProperty(e, n, {
      get() {
        return l.value;
      },
      set(r) {
        l.value = r;
      },
      enumerable: t
    }) : Object.defineProperty(e, n, { value: l, enumerable: t }));
  return e;
}
function N(e) {
  return typeof e == "function" ? e() : k(e);
}
const Oe = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const it = (e) => typeof e < "u", ut = Object.prototype.toString, dt = (e) => ut.call(e) === "[object Object]", re = () => {
}, ke = /* @__PURE__ */ ct();
function ct() {
  var e, o;
  return Oe && ((e = window == null ? void 0 : window.navigator) == null ? void 0 : e.userAgent) && (/iP(ad|hone|od)/.test(window.navigator.userAgent) || ((o = window == null ? void 0 : window.navigator) == null ? void 0 : o.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window == null ? void 0 : window.navigator.userAgent));
}
function Ee(e, o) {
  function t(...a) {
    return new Promise((n, l) => {
      Promise.resolve(e(() => o.apply(this, a), { fn: o, thisArg: this, args: a })).then(n).catch(l);
    });
  }
  return t;
}
const Ae = (e) => e();
function ft(e, o = {}) {
  let t, a, n = re;
  const l = (s) => {
    clearTimeout(s), n(), n = re;
  };
  return (s) => {
    const i = N(e), c = N(o.maxWait);
    return t && l(t), i <= 0 || c !== void 0 && c <= 0 ? (a && (l(a), a = null), Promise.resolve(s())) : new Promise((d, u) => {
      n = o.rejectOnCancel ? u : d, c && !a && (a = setTimeout(() => {
        t && l(t), a = null, d(s());
      }, c)), t = setTimeout(() => {
        a && l(a), a = null, d(s());
      }, i);
    });
  };
}
function pt(e = Ae) {
  const o = B(!0);
  function t() {
    o.value = !1;
  }
  function a() {
    o.value = !0;
  }
  const n = (...l) => {
    o.value && e(...l);
  };
  return { isActive: Be(o), pause: t, resume: a, eventFilter: n };
}
function mt(e) {
  return e || de();
}
function Ne(...e) {
  if (e.length !== 1)
    return Je(...e);
  const o = e[0];
  return typeof o == "function" ? Be(Se(() => ({ get: o, set: re }))) : B(o);
}
function vt(e, o = 200, t = {}) {
  return Ee(
    ft(o, t),
    e
  );
}
function gt(e, o = 200, t = {}) {
  const a = B(e.value), n = vt(() => {
    a.value = e.value;
  }, o, t);
  return R(e, () => n()), a;
}
function ht(e, o = {}) {
  let t = e, a, n;
  const l = Se((f, m) => (a = f, n = m, {
    get() {
      return r();
    },
    set(g) {
      s(g);
    }
  }));
  function r(f = !0) {
    return f && a(), t;
  }
  function s(f, m = !0) {
    var g, h;
    if (f === t)
      return;
    const D = t;
    ((g = o.onBeforeChange) == null ? void 0 : g.call(o, f, D)) !== !1 && (t = f, (h = o.onChanged) == null || h.call(o, f, D), m && n());
  }
  return st(
    l,
    {
      get: r,
      set: s,
      untrackedGet: () => r(!1),
      silentSet: (f) => s(f, !1),
      peek: () => r(!1),
      lay: (f) => s(f, !1)
    },
    { enumerable: !0 }
  );
}
function bt(e, o, t = {}) {
  const {
    eventFilter: a = Ae,
    ...n
  } = t;
  return R(
    e,
    Ee(
      a,
      o
    ),
    n
  );
}
function yt(e, o, t = {}) {
  const {
    eventFilter: a,
    ...n
  } = t, { eventFilter: l, pause: r, resume: s, isActive: i } = pt(a);
  return { stop: bt(
    e,
    o,
    {
      ...n,
      eventFilter: l
    }
  ), pause: r, resume: s, isActive: i };
}
function he(e, o = !0, t) {
  mt() ? Y(e, t) : o ? e() : Z(e);
}
function wt(e = !1, o = {}) {
  const {
    truthyValue: t = !0,
    falsyValue: a = !1
  } = o, n = Q(e), l = B(e);
  function r(s) {
    if (arguments.length)
      return l.value = s, l.value;
    {
      const i = N(t);
      return l.value = l.value === i ? N(a) : i, l.value;
    }
  }
  return n ? r : [l, r];
}
function j(e) {
  var o;
  const t = N(e);
  return (o = t == null ? void 0 : t.$el) != null ? o : t;
}
const J = Oe ? window : void 0;
function ae(...e) {
  let o, t, a, n;
  if (typeof e[0] == "string" || Array.isArray(e[0]) ? ([t, a, n] = e, o = J) : [o, t, a, n] = e, !o)
    return re;
  Array.isArray(t) || (t = [t]), Array.isArray(a) || (a = [a]);
  const l = [], r = () => {
    l.forEach((d) => d()), l.length = 0;
  }, s = (d, u, f, m) => (d.addEventListener(u, f, m), () => d.removeEventListener(u, f, m)), i = R(
    () => [j(o), N(n)],
    ([d, u]) => {
      if (r(), !d)
        return;
      const f = dt(u) ? { ...u } : u;
      l.push(
        ...t.flatMap((m) => a.map((g) => s(d, m, g, f)))
      );
    },
    { immediate: !0, flush: "post" }
  ), c = () => {
    i(), r();
  };
  return le(c), c;
}
function kt(e) {
  return typeof e == "function" ? e : typeof e == "string" ? (o) => o.key === e : Array.isArray(e) ? (o) => e.includes(o.key) : () => !0;
}
function Pe(...e) {
  let o, t, a = {};
  e.length === 3 ? (o = e[0], t = e[1], a = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (o = !0, t = e[0], a = e[1]) : (o = e[0], t = e[1]) : (o = !0, t = e[0]);
  const {
    target: n = J,
    eventName: l = "keydown",
    passive: r = !1,
    dedupe: s = !1
  } = a, i = kt(o);
  return ae(n, l, (d) => {
    d.repeat && N(s) || i(d) && t(d);
  }, r);
}
function $t() {
  const e = B(!1), o = de();
  return o && Y(() => {
    e.value = !0;
  }, o), e;
}
function We(e) {
  const o = $t();
  return $(() => (o.value, !!e()));
}
function _t(e, o = {}) {
  const { window: t = J } = o, a = We(() => t && "matchMedia" in t && typeof t.matchMedia == "function");
  let n;
  const l = B(!1), r = (c) => {
    l.value = c.matches;
  }, s = () => {
    n && ("removeEventListener" in n ? n.removeEventListener("change", r) : n.removeListener(r));
  }, i = X(() => {
    a.value && (s(), n = t.matchMedia(N(e)), "addEventListener" in n ? n.addEventListener("change", r) : n.addListener(r), l.value = n.matches);
  });
  return le(() => {
    i(), s(), n = void 0;
  }), l;
}
function Ct(e) {
  return JSON.parse(JSON.stringify(e));
}
const te = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, oe = "__vueuse_ssr_handlers__", Vt = /* @__PURE__ */ St();
function St() {
  return oe in te || (te[oe] = te[oe] || {}), te[oe];
}
function Fe(e, o) {
  return Vt[e] || o;
}
function Bt(e) {
  return e == null ? "any" : e instanceof Set ? "set" : e instanceof Map ? "map" : e instanceof Date ? "date" : typeof e == "boolean" ? "boolean" : typeof e == "string" ? "string" : typeof e == "object" ? "object" : Number.isNaN(e) ? "any" : "number";
}
const Tt = {
  boolean: {
    read: (e) => e === "true",
    write: (e) => String(e)
  },
  object: {
    read: (e) => JSON.parse(e),
    write: (e) => JSON.stringify(e)
  },
  number: {
    read: (e) => Number.parseFloat(e),
    write: (e) => String(e)
  },
  any: {
    read: (e) => e,
    write: (e) => String(e)
  },
  string: {
    read: (e) => e,
    write: (e) => String(e)
  },
  map: {
    read: (e) => new Map(JSON.parse(e)),
    write: (e) => JSON.stringify(Array.from(e.entries()))
  },
  set: {
    read: (e) => new Set(JSON.parse(e)),
    write: (e) => JSON.stringify(Array.from(e))
  },
  date: {
    read: (e) => new Date(e),
    write: (e) => e.toISOString()
  }
}, $e = "vueuse-storage";
function Dt(e, o, t, a = {}) {
  var n;
  const {
    flush: l = "pre",
    deep: r = !0,
    listenToStorageChanges: s = !0,
    writeDefaults: i = !0,
    mergeDefaults: c = !1,
    shallow: d,
    window: u = J,
    eventFilter: f,
    onError: m = (v) => {
      console.error(v);
    },
    initOnMounted: g
  } = a, h = (d ? Ue : B)(typeof o == "function" ? o() : o);
  if (!t)
    try {
      t = Fe("getDefaultStorage", () => {
        var v;
        return (v = J) == null ? void 0 : v.localStorage;
      })();
    } catch (v) {
      m(v);
    }
  if (!t)
    return h;
  const D = N(o), x = Bt(D), P = (n = a.serializer) != null ? n : Tt[x], { pause: S, resume: C } = yt(
    h,
    () => L(h.value),
    { flush: l, deep: r, eventFilter: f }
  );
  u && s && he(() => {
    ae(u, "storage", F), ae(u, $e, ee), g && F();
  }), g || F();
  function E(v, M) {
    u && u.dispatchEvent(new CustomEvent($e, {
      detail: {
        key: e,
        oldValue: v,
        newValue: M,
        storageArea: t
      }
    }));
  }
  function L(v) {
    try {
      const M = t.getItem(e);
      if (v == null)
        E(M, null), t.removeItem(e);
      else {
        const z = P.write(v);
        M !== z && (t.setItem(e, z), E(M, z));
      }
    } catch (M) {
      m(M);
    }
  }
  function K(v) {
    const M = v ? v.newValue : t.getItem(e);
    if (M == null)
      return i && D != null && t.setItem(e, P.write(D)), D;
    if (!v && c) {
      const z = P.read(M);
      return typeof c == "function" ? c(z, D) : x === "object" && !Array.isArray(z) ? { ...D, ...z } : z;
    } else
      return typeof M != "string" ? M : P.read(M);
  }
  function F(v) {
    if (!(v && v.storageArea !== t)) {
      if (v && v.key == null) {
        h.value = D;
        return;
      }
      if (!(v && v.key !== e)) {
        S();
        try {
          (v == null ? void 0 : v.newValue) !== P.write(h.value) && (h.value = K(v));
        } catch (M) {
          m(M);
        } finally {
          v ? Z(C) : C();
        }
      }
    }
  }
  function ee(v) {
    F(v.detail);
  }
  return h;
}
function Mt(e) {
  return _t("(prefers-color-scheme: dark)", e);
}
function Ot(e = {}) {
  const {
    selector: o = "html",
    attribute: t = "class",
    initialValue: a = "auto",
    window: n = J,
    storage: l,
    storageKey: r = "vueuse-color-scheme",
    listenToStorageChanges: s = !0,
    storageRef: i,
    emitAuto: c,
    disableTransition: d = !0
  } = e, u = {
    auto: "",
    light: "light",
    dark: "dark",
    ...e.modes || {}
  }, f = Mt({ window: n }), m = $(() => f.value ? "dark" : "light"), g = i || (r == null ? Ne(a) : Dt(r, a, l, { window: n, listenToStorageChanges: s })), h = $(() => g.value === "auto" ? m.value : g.value), D = Fe(
    "updateHTMLAttrs",
    (C, E, L) => {
      const K = typeof C == "string" ? n == null ? void 0 : n.document.querySelector(C) : j(C);
      if (!K)
        return;
      let F;
      if (d && (F = n.document.createElement("style"), F.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")), n.document.head.appendChild(F)), E === "class") {
        const ee = L.split(/\s/g);
        Object.values(u).flatMap((v) => (v || "").split(/\s/g)).filter(Boolean).forEach((v) => {
          ee.includes(v) ? K.classList.add(v) : K.classList.remove(v);
        });
      } else
        K.setAttribute(E, L);
      d && (n.getComputedStyle(F).opacity, document.head.removeChild(F));
    }
  );
  function x(C) {
    var E;
    D(o, t, (E = u[C]) != null ? E : C);
  }
  function P(C) {
    e.onChanged ? e.onChanged(C, x) : x(C);
  }
  R(h, P, { flush: "post", immediate: !0 }), he(() => P(h.value));
  const S = $({
    get() {
      return c ? g.value : h.value;
    },
    set(C) {
      g.value = C;
    }
  });
  try {
    return Object.assign(S, { store: g, system: m, state: h });
  } catch {
    return S;
  }
}
function Et(e, o, t = {}) {
  const { window: a = J, ...n } = t;
  let l;
  const r = We(() => a && "ResizeObserver" in a), s = () => {
    l && (l.disconnect(), l = void 0);
  }, i = $(() => Array.isArray(e) ? e.map((u) => j(u)) : [j(e)]), c = R(
    i,
    (u) => {
      if (s(), r.value && a) {
        l = new ResizeObserver(o);
        for (const f of u)
          f && l.observe(f, n);
      }
    },
    { immediate: !0, flush: "post" }
  ), d = () => {
    s(), c();
  };
  return le(d), {
    isSupported: r,
    stop: d
  };
}
function At(e, o = { width: 0, height: 0 }, t = {}) {
  const { window: a = J, box: n = "content-box" } = t, l = $(() => {
    var u, f;
    return (f = (u = j(e)) == null ? void 0 : u.namespaceURI) == null ? void 0 : f.includes("svg");
  }), r = B(o.width), s = B(o.height), { stop: i } = Et(
    e,
    ([u]) => {
      const f = n === "border-box" ? u.borderBoxSize : n === "content-box" ? u.contentBoxSize : u.devicePixelContentBoxSize;
      if (a && l.value) {
        const m = j(e);
        if (m) {
          const g = a.getComputedStyle(m);
          r.value = Number.parseFloat(g.width), s.value = Number.parseFloat(g.height);
        }
      } else if (f) {
        const m = Array.isArray(f) ? f : [f];
        r.value = m.reduce((g, { inlineSize: h }) => g + h, 0), s.value = m.reduce((g, { blockSize: h }) => g + h, 0);
      } else
        r.value = u.contentRect.width, s.value = u.contentRect.height;
    },
    t
  );
  he(() => {
    const u = j(e);
    u && (r.value = "offsetWidth" in u ? u.offsetWidth : o.width, s.value = "offsetHeight" in u ? u.offsetHeight : o.height);
  });
  const c = R(
    () => j(e),
    (u) => {
      r.value = u ? o.width : 0, s.value = u ? o.height : 0;
    }
  );
  function d() {
    i(), c();
  }
  return {
    width: r,
    height: s,
    stop: d
  };
}
function se(e) {
  return typeof Window < "u" && e instanceof Window ? e.document.documentElement : typeof Document < "u" && e instanceof Document ? e.documentElement : e;
}
function Le(e) {
  const o = window.getComputedStyle(e);
  if (o.overflowX === "scroll" || o.overflowY === "scroll" || o.overflowX === "auto" && e.clientWidth < e.scrollWidth || o.overflowY === "auto" && e.clientHeight < e.scrollHeight)
    return !0;
  {
    const t = e.parentNode;
    return !t || t.tagName === "BODY" ? !1 : Le(t);
  }
}
function Nt(e) {
  const o = e || window.event, t = o.target;
  return Le(t) ? !1 : o.touches.length > 1 ? !0 : (o.preventDefault && o.preventDefault(), !1);
}
const ne = /* @__PURE__ */ new WeakMap();
function Pt(e, o = !1) {
  const t = B(o);
  let a = null;
  R(Ne(e), (r) => {
    const s = se(N(r));
    if (s) {
      const i = s;
      ne.get(i) || ne.set(i, i.style.overflow), t.value && (i.style.overflow = "hidden");
    }
  }, {
    immediate: !0
  });
  const n = () => {
    const r = se(N(e));
    !r || t.value || (ke && (a = ae(
      r,
      "touchmove",
      (s) => {
        Nt(s);
      },
      { passive: !1 }
    )), r.style.overflow = "hidden", t.value = !0);
  }, l = () => {
    var r;
    const s = se(N(e));
    !s || !t.value || (ke && (a == null || a()), s.style.overflow = (r = ne.get(s)) != null ? r : "", ne.delete(s), t.value = !1);
  };
  return le(l), $({
    get() {
      return t.value;
    },
    set(r) {
      r ? n() : l();
    }
  });
}
function U(e, o, t, a = {}) {
  var n, l, r;
  const {
    clone: s = !1,
    passive: i = !1,
    eventName: c,
    deep: d = !1,
    defaultValue: u,
    shouldEmit: f
  } = a, m = de(), g = t || (m == null ? void 0 : m.emit) || ((n = m == null ? void 0 : m.$emit) == null ? void 0 : n.bind(m)) || ((r = (l = m == null ? void 0 : m.proxy) == null ? void 0 : l.$emit) == null ? void 0 : r.bind(m == null ? void 0 : m.proxy));
  let h = c;
  o || (o = "modelValue"), h = h || `update:${o.toString()}`;
  const D = (S) => s ? typeof s == "function" ? s(S) : Ct(S) : S, x = () => it(e[o]) ? D(e[o]) : u, P = (S) => {
    f ? f(S) && g(h, S) : g(h, S);
  };
  if (i) {
    const S = x(), C = B(S);
    let E = !1;
    return R(
      () => e[o],
      (L) => {
        E || (E = !0, C.value = D(L), Z(() => E = !1));
      }
    ), R(
      C,
      (L) => {
        !E && (L !== e[o] || d) && P(L);
      },
      { deep: d }
    ), C;
  } else
    return $({
      get() {
        return x();
      },
      set(S) {
        P(S);
      }
    });
}
const Wt = /* @__PURE__ */ T({
  __name: "Notification",
  props: {
    message: {},
    type: { default: "info" },
    classes: {},
    duration: { default: 3e3 },
    placement: { default: "top-center" },
    onClose: {}
  },
  setup(e) {
    const o = e, t = {
      success: "i-carbon-checkmark",
      info: "i-material-symbols-light-info",
      warning: "i-carbon-warning",
      error: "i-carbon-close"
    }, a = {
      success: "text-primary-500 border-primary-200 dark:text-primary-200 dark:border-primary-500",
      info: "text-blue-4 border-blue-2 dark:text-blue-2 dark:border-blue-4",
      warning: "text-amber-4 border-amber-2 dark:border-amber-4",
      error: "text-red-4 border-red-2 dark:border-red-4"
    }, n = B(!1);
    Y(() => {
      n.value = !0, setTimeout(() => {
        n.value = !1;
      }, o.duration);
    });
    const l = $(() => o.placement.startsWith("top") ? "translate-y--300%" : "translate-y-300%");
    return (r, s) => (p(), _("div", {
      class: V(["fixed left-0 right-0 $ui-z-max-override text-center", [
        { "top-0": r.placement.startsWith("top") },
        { "bottom-0": r.placement.startsWith("bottom") }
      ]])
    }, [
      W(ce, {
        "enter-from-class": l.value,
        "leave-to-class": l.value,
        onAfterLeave: s[0] || (s[0] = () => {
          var i;
          n.value || (i = r.onClose) == null || i.call(r);
        })
      }, {
        default: y(() => [
          n.value ? (p(), _("div", {
            key: 0,
            class: "flex transition-all duration-300",
            style: fe({ justifyContent: r.placement.includes("right") ? "right" : r.placement.includes("left") ? "left" : "center" })
          }, [
            b("div", {
              class: V(["m3 flex-inline items-center gap2 b-1 b-1 rounded px4 py1 shadow transition-all duration-300 $ui-bg-base", [r.classes, a[r.type]]])
            }, [
              b("div", {
                class: V(t[r.type])
              }, null, 2),
              b("div", null, I(r.message), 1)
            ], 2)
          ], 4)) : A("", !0)
        ]),
        _: 1
      }, 8, ["enter-from-class", "leave-to-class"])
    ], 2));
  }
});
function fo(e) {
  const o = document.createElement("div");
  o.classList.add("$ui-z-max-override", "fixed"), document.body.appendChild(o);
  const t = e.onClose;
  function a() {
    be(null, o);
  }
  e.onClose = () => {
    a(), t == null || t(), document.body.removeChild(o);
  };
  const n = Ke(Wt, e);
  be(n, o);
}
const Ft = "__vue-devtools-theme__";
function Lt(e = {}) {
  const o = Ot({
    ...e,
    storageKey: Ft
  });
  return {
    colorMode: o,
    isDark: $(() => o.value === "dark")
  };
}
const Rt = { class: "$ui-dark-toggle-vtr" }, po = /* @__PURE__ */ T({
  __name: "DarkToggle",
  props: {
    isDark: { type: Boolean, default: !1 },
    animation: { type: Boolean, default: !0 },
    animationDuration: { default: 400 }
  },
  setup(e) {
    const o = e, t = U(o, "isDark"), { colorMode: a } = Lt({
      initialValue: t.value ? "dark" : "light",
      onChanged: (s) => {
        t.value = s === "dark";
      }
    }), n = $({
      get: () => a.value === "dark",
      set: (s) => a.value = s ? "dark" : "light"
    }), l = document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function r(s) {
      if (!l || !s || !o.animation) {
        n.value = !n.value;
        return;
      }
      const i = s.clientX, c = s.clientY, d = Math.hypot(
        Math.max(i, innerWidth - i),
        Math.max(c, innerHeight - c)
      );
      document.startViewTransition(async () => {
        n.value = !n.value, await Z();
      }).ready.then(() => {
        const f = [
          `circle(0px at ${i}px ${c}px)`,
          `circle(${d}px at ${i}px ${c}px)`
        ];
        document.documentElement.animate(
          {
            clipPath: n.value ? [...f].reverse() : f
          },
          {
            duration: o.animationDuration,
            easing: "ease-in",
            pseudoElement: n.value ? "::view-transition-old(root)" : "::view-transition-new(root)"
          }
        );
      });
    }
    return (s, i) => (p(), _("span", Rt, [
      w(s.$slots, "default", pe(me({ mode: k(a), isDark: n.value, toggle: r })))
    ]));
  }
}), xt = {}, zt = { class: "$ui-base border $ui-border-base rounded shadow-sm" };
function jt(e, o) {
  return p(), _("div", zt, [
    w(e.$slots, "default")
  ]);
}
const mo = /* @__PURE__ */ ge(xt, [["render", jt]]), Re = /* @__PURE__ */ T({
  __name: "Overlay",
  props: {
    dim: { type: Boolean },
    blur: { type: Boolean }
  },
  setup(e) {
    return (o, t) => (p(), _("div", {
      class: V(["fixed left-0 top-0 $ui-z-max h-full w-full $ui-fcc transition-opacity transition-duration-300 $ui-bg-base", [
        o.dim ? "bg-opacity-50!" : "bg-opacity-0!",
        o.blur ? "backdrop-blur-sm" : ""
      ]])
    }, [
      w(o.$slots, "default")
    ], 2));
  }
}), It = { class: "h7.5 w-full $ui-fbc" }, Ht = { class: "text-4.5" }, Jt = /* @__PURE__ */ b("div", { class: "i-carbon-close" }, null, -1), Ut = [
  Jt
], Kt = { class: "content transition-all transition-duration-300" }, Gt = { class: "footer h8 w-full transition-all transition-duration-300 delay-250" }, Yt = { class: "$ui-fcc" }, Xt = /* @__PURE__ */ T({
  __name: "Dialog",
  props: {
    modelValue: { type: Boolean, default: !1 },
    autoClose: { type: Boolean, default: !0 },
    title: { default: "Dialog" },
    width: { default: "32rem" },
    height: { default: "18rem" },
    closable: { type: Boolean, default: !0 },
    mountTo: { default: "body" },
    dim: { type: Boolean },
    blur: { type: Boolean }
  },
  emits: ["close", "update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = U(t, "modelValue", o, { passive: !0 }), l = Pt(() => window.document.documentElement);
    X(() => {
      n.value ? l.value = !0 : l.value = !1;
    });
    function r() {
      n.value && t.autoClose && (n.value = !1);
    }
    Pe("Escape", () => {
      r();
    });
    const s = B(!1);
    return Y(() => s.value = !0), (i, c) => s.value || i.mountTo === "body" ? (p(), O(Te, {
      key: 0,
      to: i.mountTo
    }, [
      W(ce, {
        "enter-from-class": "opacity-0 [&_.modal]:scale-95 [&_.content,&_.footer]:translate-y--2.5 [&_.content,&_.footer]:opacity-0",
        "enter-to-class": "opacity-100 [&_.modal]:scale-100",
        "leave-from-class": "opacity-100 [&_.modal]:scale-100",
        "leave-to-class": "opacity-0 [&_.modal]:scale-95"
      }, {
        default: y(() => [
          k(n) ? (p(), O(Re, {
            key: 0,
            dim: i.dim,
            blur: i.blur
          }, {
            default: y(() => [
              b("div", {
                class: "modal relative grid grid-rows-[1.875rem_1fr_2.5rem] $ui-base max-h-[calc(100vh-6.25rem)] max-w-[calc(100vw-6.25rem)] min-h-6.25rem min-w-12.5rem gap-2.5 rounded-md bg-white px6 py4.5 color-gray-800 shadow-2xl transition-transform transition-duration-300 dark:bg-gray-900 dark:color-gray-200",
                style: fe({
                  width: t.width,
                  height: t.height
                })
              }, [
                b("div", It, [
                  b("div", Ht, [
                    w(i.$slots, "title", {}, () => [
                      H(I(t.title), 1)
                    ])
                  ]),
                  i.closable ? (p(), _("div", {
                    key: 0,
                    class: "h6 w6 $ui-fcc cursor-pointer rounded-full transition-colors hover:bg-primary-100 dark:hover:bg-gray-700",
                    onClick: r
                  }, Ut)) : A("", !0)
                ]),
                b("div", Kt, [
                  w(i.$slots, "default")
                ]),
                b("div", Gt, [
                  w(i.$slots, "footer", {}, () => [
                    w(i.$slots, "footer", {}, () => [
                      b("div", Yt, [
                        W(G, {
                          type: "primary",
                          onClick: r
                        }, {
                          default: y(() => [
                            H(" close ")
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ])
                ])
              ], 4)
            ]),
            _: 3
          }, 8, ["dim", "blur"])) : A("", !0)
        ]),
        _: 3
      })
    ], 8, ["to"])) : A("", !0);
  }
}), qt = ["type", "placeholder", "disabled"], Qt = {
  key: 3,
  class: "pointer-events-none absolute bottom--0.25 left-50% right-50% z-9999 h-0.75 bg-primary-500 opacity-0 transition-all duration-240 group-[&.focused]:left-0 group-[&.focused]:right-0 group-[&.focused]:opacity-100 group-[&.accent.focused]:bg-accent-500"
}, ie = "transition-colors $ui-fcc color-gray-500 dark:color-gray-300 group-[&.focused]:color-primary-500; group-[&.accent.focused]:color-accent-500", Zt = /* @__PURE__ */ T({
  __name: "Input",
  props: {
    modelValue: {},
    placeholder: { default: "" },
    variant: { default: "normal" },
    disabled: { type: Boolean, default: !1 },
    leftIcon: {},
    rightIcon: {},
    loading: { type: Boolean, default: !1 },
    autoFocus: { type: Boolean, default: !1 },
    loadingDebounceTime: { default: 0 },
    readonly: { type: Boolean, default: !1 },
    type: { default: "text" }
  },
  emits: ["update:modelValue", "updateFocused", "keyTab"],
  setup(e, { emit: o }) {
    const t = e, a = o, n = U(t, "modelValue", a), l = gt($(() => t.loading), t.loadingDebounceTime), r = ht(!1, {
      onChanged(u) {
        a("updateFocused", u);
      }
    }), s = $(() => t.variant === "flat" || t.variant === "warning" || t.disabled || t.readonly), i = $(() => t.disabled || l.value), c = B();
    let d = !1;
    return X(() => {
      l.value && r.value ? d = !0 : !l.value && d && (d = !1, Z(() => {
        r.value = !0;
      }));
    }), Y(() => {
      t.autoFocus && (r.value = !0);
    }), X(() => {
      var u;
      r.value && ((u = c.value) == null || u.focus());
    }), (u, f) => (p(), _("div", {
      class: V(["group relative w-50 w-auto flex items-center justify-between gap-0.5 overflow-hidden b-1 rounded-1 px3 py-0.75 color-gray-800 dark:color-gray-100", [
        {
          "border-none bg-transparent group": u.variant === "flat",
          "cursor-not-allowed opacity-50": i.value,
          accent: u.variant === "accent",
          focused: k(r)
        },
        [
          u.variant === "warning" ? "border-warning-500 dark:border-warning-300" : "border-primary-100 dark:border-gray-700"
        ]
      ]]),
      onClick: f[2] || (f[2] = () => {
        r.value = !0;
      })
    }, [
      u.leftIcon ? (p(), _("div", {
        key: 0,
        class: V(ie)
      }, [
        W(ue, { icon: u.leftIcon }, null, 8, ["icon"])
      ])) : A("", !0),
      ve(b("input", {
        ref_key: "inputRef",
        ref: c,
        "onUpdate:modelValue": f[0] || (f[0] = (m) => Q(n) ? n.value = m : null),
        class: "$ui-base w-full bg-transparent color-inherit outline-none placeholder-color-gray-500 dark:placeholder-gray-300",
        type: u.type,
        placeholder: u.placeholder,
        disabled: i.value || u.readonly,
        onBlur: f[1] || (f[1] = (m) => r.value = !1)
      }, null, 40, qt), [
        [Ge, k(n)]
      ]),
      k(l) ? (p(), _("div", {
        key: 1,
        class: V(ie)
      }, [
        W(Me)
      ])) : u.rightIcon ? (p(), _("div", {
        key: 2,
        class: V(ie)
      }, [
        W(ue, { icon: u.rightIcon }, null, 8, ["icon"])
      ])) : A("", !0),
      s.value ? A("", !0) : (p(), _("div", Qt))
    ], 2));
  }
}), eo = { class: "$ui-base" }, vo = /* @__PURE__ */ T({
  __name: "FormField",
  props: {
    modelValue: {},
    status: { default: "normal" },
    showMessage: { type: Boolean, default: !0 },
    message: { default: "" },
    placeholder: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, n = U(t, "modelValue", o), l = B(!1), r = $(() => t.message && t.message.length && t.showMessage), s = {
      normal: "color-gray-600 dark:color-gray-400",
      warning: "color-warning-500 dark:color-warning-200",
      danger: "color-danger-500 dark:color-danger-200",
      success: "color-primary-700 dark:color-primary-500"
    }, i = {
      warning: "i-bx:bxs-error",
      danger: "i-ic-round-error",
      success: "i-ep:success-filled"
    };
    return (c, d) => (p(), _("div", eo, [
      W(Zt, {
        modelValue: k(n),
        "onUpdate:modelValue": d[0] || (d[0] = (u) => Q(n) ? n.value = u : null),
        placeholder: c.placeholder,
        onUpdateFocused: d[1] || (d[1] = (u) => l.value = u)
      }, null, 8, ["modelValue", "placeholder"]),
      b("div", {
        class: V(["mt2 $ui-base text-3.5", [
          s[c.status],
          { "opacity-65": !l.value }
        ]])
      }, [
        c.status !== "normal" && r.value ? (p(), O(ue, {
          key: 0,
          inline: "",
          icon: i[c.status]
        }, null, 8, ["icon"])) : A("", !0),
        H(" " + I(r.value ? c.message : ""), 1)
      ], 2)
    ]));
  }
}), to = { class: "overflow-hidden rounded-lg shadow-lg" }, oo = /* @__PURE__ */ b("div", { class: "p2 opacity-40" }, " Empty... ", -1), no = /* @__PURE__ */ T({
  __name: "Dropdown",
  props: {
    label: {},
    buttonProps: { default: () => ({}) },
    buttonClass: { default: "" },
    trigger: { default: "click" },
    distance: { default: 0 },
    skidding: {},
    placement: {},
    disabled: { type: Boolean, default: !1 },
    shown: { type: Boolean }
  },
  emits: ["update:visible"],
  setup(e) {
    const o = e;
    return Ye("$ui-dropdown-disabled", $(() => o.disabled)), (t, a) => (p(), O(k(xe), {
      disabled: t.disabled,
      class: "inline-block w-auto",
      shown: t.shown,
      triggers: [t.trigger],
      distance: t.distance + 6,
      placement: t.placement,
      skidding: t.skidding,
      "onUpdate:shown": a[0] || (a[0] = (n) => t.$emit("update:visible", n)),
      onClick: a[1] || (a[1] = (n) => {
        n.stopPropagation();
      })
    }, {
      popper: y(({ hide: n }) => [
        b("div", to, [
          w(t.$slots, "popper", pe(me({ hide: n })), () => [
            oo
          ])
        ])
      ]),
      default: y(() => [
        w(t.$slots, "default", {}, () => [
          W(G, q({
            ...t.buttonProps,
            disabled: t.disabled
          }, { class: t.buttonClass }), De({
            icon: y(() => [
              w(t.$slots, "button-icon")
            ]),
            "icon-right": y(() => [
              w(t.$slots, "button-icon-right")
            ]),
            _: 2
          }, [
            t.label ? {
              name: "default",
              fn: y(() => [
                H(I(t.label), 1)
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["class"])
        ])
      ]),
      _: 3
    }, 8, ["disabled", "shown", "triggers", "distance", "placement", "skidding"]));
  }
}), go = /* @__PURE__ */ T({
  __name: "DropdownButton",
  props: {
    type: {},
    round: { type: [String, Boolean] },
    loading: { type: Boolean },
    disabled: { type: Boolean },
    size: {},
    flat: { type: Boolean },
    outlined: { type: Boolean },
    keepOpen: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e, t = Xe("$ui-dropdown-disabled", void 0);
    return (a, n) => ve((p(), O(G, q({
      ...o,
      round: !1
    }, {
      disabled: k(t),
      class: "w-full justify-start transition-colors not-action:bg-transparent!"
    }), {
      icon: y(() => [
        w(a.$slots, "icon")
      ]),
      default: y(() => [
        w(a.$slots, "default")
      ]),
      _: 3
    }, 16, ["disabled"])), [
      [k(_e)]
    ]);
  }
}), ro = { class: "$ui-fec gap2.5" }, ho = /* @__PURE__ */ T({
  __name: "Confirm",
  props: {
    modelValue: { type: Boolean },
    content: {},
    cancelText: { default: "Cancel" },
    confirmText: { default: "Confirm" },
    width: { default: "20%" },
    height: { default: "9rem" },
    title: { default: "Warning" },
    loading: { type: Boolean, default: !1 },
    autoClose: { type: Boolean, default: !0 }
  },
  emits: ["update:modelValue", "confirm", "cancel", "close"],
  setup(e, { emit: o }) {
    const t = e, a = o, n = U(t, "modelValue", a);
    X(() => {
      n.value || a("close");
    });
    function l(r = !1) {
      (t.autoClose || r) && (n.value = !1);
    }
    return (r, s) => (p(), O(Xt, {
      modelValue: k(n),
      "onUpdate:modelValue": s[2] || (s[2] = (i) => Q(n) ? n.value = i : null),
      width: r.width,
      height: r.height,
      title: r.title,
      closable: !1
    }, {
      footer: y(() => [
        b("div", ro, [
          W(G, {
            onClick: s[0] || (s[0] = () => {
              a("cancel"), l(!0);
            })
          }, {
            default: y(() => [
              H(I(r.cancelText), 1)
            ]),
            _: 1
          }),
          W(G, {
            loading: r.loading,
            type: "primary",
            onClick: s[1] || (s[1] = () => {
              a("confirm"), l();
            })
          }, {
            default: y(() => [
              H(I(r.confirmText), 1)
            ]),
            _: 1
          }, 8, ["loading"])
        ])
      ]),
      default: y(() => [
        w(r.$slots, "default", { class: "h-auto w-auto" }, () => [
          H(I(r.content), 1)
        ])
      ]),
      _: 3
    }, 8, ["modelValue", "width", "height", "title"]));
  }
}), ao = { class: "m1 min-w-35 w-auto flex flex-col" }, lo = ["onClick"], so = /* @__PURE__ */ b("div", { class: "i-mdi-chevron-down" }, null, -1), bo = /* @__PURE__ */ T({
  __name: "Select",
  props: {
    modelValue: {},
    multiple: { default: !1 },
    options: {},
    placeholder: { default: "Select..." },
    autoClose: { type: Boolean, default: !0 },
    disabled: { type: Boolean, default: !1 },
    labelRenderer: { type: Function, default: (e) => String(e) },
    buttonProps: { default: () => ({}) }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const t = e, a = o, n = Ce(), l = $({
      get: () => t.modelValue,
      set: (i) => a("update:modelValue", i)
    }), r = $(() => {
      const i = t.options.find((c) => c.value === l.value);
      return i != null && i.label ? t.labelRenderer(i.label) : t.placeholder;
    });
    function s(i) {
      t.multiple ? l.value = l.value.includes(i.value) ? l.value.filter((c) => c !== i.value) : [...l.value, i.value] : l.value = i.value;
    }
    return (i, c) => (p(), O(no, q({ label: r.value }, {
      buttonProps: i.buttonProps,
      disabled: i.disabled
    }), De({
      popper: y(() => [
        b("div", ao, [
          k(n).item ? (p(!0), _(ye, { key: 0 }, we(i.options, (d) => (p(), _("div", {
            key: d.value,
            class: "cursor-pointer",
            onClick: (u) => s(d)
          }, [
            w(i.$slots, "item", pe(me({
              item: d,
              active: i.multiple ? l.value.includes(d.value) : d.value === l.value,
              disabled: i.disabled
            })))
          ], 8, lo))), 128)) : (p(!0), _(ye, { key: 1 }, we(i.options, (d) => ve((p(), O(G, {
            key: d.value,
            disabled: i.disabled,
            round: "normal",
            class: V(["flex-[auto_1_1] not-hover:[&:not(.active)]:bg-transparent!", {
              active: i.multiple ? l.value.includes(d.value) : d.value === l.value
            }]),
            onClick: (u) => s(d)
          }, {
            default: y(() => [
              H(I(d.label), 1)
            ]),
            _: 2
          }, 1032, ["disabled", "class", "onClick"])), [
            [k(_e), i.autoClose]
          ])), 128))
        ])
      ]),
      "button-icon-right": y(() => [
        so
      ]),
      _: 2
    }, [
      k(n).button ? {
        name: "default",
        fn: y(() => [
          w(i.$slots, "button")
        ]),
        key: "0"
      } : void 0
    ]), 1040, ["label"]));
  }
}), yo = /* @__PURE__ */ T({
  __name: "Switch",
  props: {
    modelValue: { type: Boolean },
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const n = U(e, "modelValue", o), l = wt(n);
    return (r, s) => (p(), _("div", {
      class: V([[
        r.disabled ? "cursor-not-allowed" : "cursor-pointer"
      ], "$ui-base $ui-if-sc cursor-pointer select-none gap1.25 vertical-mid text-3.5"]),
      role: "checkbox",
      onClick: s[0] || (s[0] = (i) => !r.disabled && k(l)())
    }, [
      w(r.$slots, "default"),
      b("div", {
        class: V([{
          selected: k(n)
        }, "group relative $ui-base h4 w8 rounded-2 bg-primary-100 transition-colors dark:bg-gray-700 [&.selected]:bg-primary-500!"])
      }, [
        b("div", {
          class: V(["h4 w4 rounded-full bg-primary-800 transition-transform group-[&.selected]:transform-translate-x-4 dark:bg-white", [
            { "group-hover:opacity-75 group-active:scale-85": !r.disabled },
            { "opacity-65": r.disabled }
          ]])
        }, null, 2)
      ], 2)
    ], 2));
  }
}), wo = /* @__PURE__ */ T({
  __name: "Checkbox",
  props: {
    modelValue: { type: Boolean },
    variant: { default: "normal" }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const n = U(e, "modelValue", o);
    return (l, r) => (p(), _("div", {
      class: V(["relative $ui-base h5 w5 $ui-inline-fcc cursor-pointer border-0.125rem rounded-1.25 transition-colors duration-200 ease-in-out", [
        k(n) ? l.variant === "normal" ? "bg-primary-500 border-primary-200 dark:border-primary-100" : "bg-accent-500 border-accent-200 dark:border-accent-100" : ""
      ]]),
      onClick: r[0] || (r[0] = (s) => n.value = !k(n))
    }, [
      b("div", {
        class: V([[
          k(n) ? "opacity-100" : "opacity-0"
        ], "h-60% w-35% transform-translate-y--0.25 transform-rotate-45 border-width-[0_0.125rem_0.125rem_0] border-white border-solid transition-opacity duration-200 ease-in-out"])
      }, null, 2)
    ], 2));
  }
}), ko = /* @__PURE__ */ T({
  __name: "Drawer",
  props: {
    modelValue: { type: Boolean },
    mountTo: { default: "body" },
    placement: { default: "right" },
    closeOutside: { type: Boolean, default: !0 },
    closable: { type: Boolean, default: !0 },
    contentClass: {},
    permanent: { type: Boolean, default: !1 },
    contentBlur: { type: Boolean, default: !1 },
    top: {},
    dim: { type: Boolean },
    blur: { type: Boolean }
  },
  emits: ["update:modelValue", "close"],
  setup(e, { emit: o }) {
    const t = e, a = o, { height: n } = At(() => typeof t.top == "string" ? document.querySelector(t.top) : t.top, void 0, { box: "border-box" }), l = U(t, "modelValue", a), r = {
      left: {
        class: "left-0 h-full b-r",
        transition: "[&_.drawer]:translate-x--100%"
      },
      right: {
        class: "right-0 h-full b-l",
        transition: "[&_.drawer]:translate-x-full"
      },
      top: {
        class: "w-full b-b",
        transition: "[&_.drawer]:translate-y--100%"
      },
      bottom: {
        class: "bottom-0 w-full b-t",
        transition: "[&_.drawer]:translate-y-100%"
      }
    };
    Pe("Escape", () => {
      t.closable && (l.value = !1);
    });
    const s = $(() => r[t.placement]), i = B(!1);
    return Y(() => i.value = !0), (c, d) => i.value || c.mountTo === "body" ? (p(), O(Te, {
      key: 0,
      to: c.mountTo
    }, [
      W(ce, {
        "enter-from-class": `${s.value.transition}`,
        "leave-to-class": `${s.value.transition}`
      }, {
        default: y(() => [
          k(l) ? (p(), O(Re, {
            key: 0,
            class: V({
              "pointer-events-none": c.permanent
            }),
            dim: c.dim,
            blur: c.blur,
            onClick: d[2] || (d[2] = (u) => c.closeOutside && c.closable && (l.value = !1))
          }, {
            default: y(() => [
              b("div", {
                class: V([[s.value.class, c.contentClass ?? "", c.contentBlur ? "$ui-glass-effect" : "$ui-bg-base"], "drawer pointer-events-auto absolute min-w-25 of-auto $ui-border-base transition-transform transition-duration-300"]),
                style: fe({
                  top: c.placement === "bottom" ? "auto" : `${k(n)}px`,
                  height: ["top", "bottom"].includes(c.placement) ? "auto" : `calc(100% - ${k(n)}px)`
                }),
                onClick: d[1] || (d[1] = qe(() => {
                }, ["stop"]))
              }, [
                c.closable ? (p(), _("div", {
                  key: 0,
                  class: "i-carbon-close absolute right-1.5 top-1.5 $ui-z-max cursor-pointer p1 text-lg $ui-text",
                  onClick: d[0] || (d[0] = (u) => l.value = !1)
                })) : A("", !0),
                w(c.$slots, "default")
              ], 6)
            ]),
            _: 3
          }, 8, ["class", "dim", "blur"])) : A("", !0)
        ]),
        _: 3
      }, 8, ["enter-from-class", "leave-to-class"])
    ], 8, ["to"])) : A("", !0);
  }
}), $o = /* @__PURE__ */ T({
  __name: "Tooltip",
  props: {
    trigger: {},
    distance: {},
    skidding: {},
    placement: {},
    disabled: { type: Boolean },
    shown: { type: Boolean }
  },
  setup(e) {
    return (o, t) => (p(), O(k(ze), q({
      disabled: o.disabled,
      placement: o.placement
    }, o.$attrs), {
      popper: y(() => [
        w(o.$slots, "popper")
      ]),
      default: y(() => [
        w(o.$slots, "default")
      ]),
      _: 3
    }, 16, ["disabled", "placement"]));
  }
});
export {
  Ft as THEME_KEY,
  Vo as VTooltip,
  co as VueBadge,
  G as VueButton,
  mo as VueCard,
  wo as VueCheckbox,
  ho as VueConfirm,
  po as VueDarkToggle,
  Xt as VueDialog,
  ko as VueDrawer,
  no as VueDropdown,
  go as VueDropdownButton,
  vo as VueFormField,
  ue as VueIcon,
  Zt as VueInput,
  Me as VueLoadingIndicator,
  Wt as VueNotification,
  Re as VueOverlay,
  bo as VueSelect,
  yo as VueSwitch,
  $o as VueTooltip,
  fo as showVueNotification,
  Lt as useDevToolsColorMode
};
