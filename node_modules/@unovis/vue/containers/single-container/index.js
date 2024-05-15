import { defineComponent as f, toRefs as m, reactive as u, ref as v, watchEffect as g, watch as y, onUnmounted as w, provide as a, openBlock as _, createElementBlock as h, renderSlot as C, toRaw as s } from "vue";
import { SingleContainer as R } from "@unovis/ts";
import { componentAccessorKey as k, tooltipAccessorKey as x, annotationsAccessorKey as A } from "../../utils/context.js";
import { useForwardProps as K } from "../../utils/props.js";
const b = /* @__PURE__ */ f({
  __name: "index",
  props: {
    component: {},
    tooltip: {},
    annotations: {},
    duration: {},
    margin: {},
    padding: {},
    sizing: {},
    width: {},
    height: {},
    svgDefs: {},
    ariaLabel: {},
    data: {}
  },
  setup(c, { expose: d }) {
    const r = c, { data: n } = m(r), l = K(r);
    let o;
    const e = u({
      component: void 0,
      tooltip: void 0,
      annotations: void 0
    }), i = v(), p = () => {
      o || i.value && e.component && (o = new R(i.value, { ...s(e) }, n.value));
    };
    return g(() => {
      var t;
      p(), (t = e.component) == null || t.config, o == null || o.updateContainer({ ...s(l.value), ...s(e) });
    }), y(n, () => {
      o ? o.setData(n.value, !0) : p();
    }), w(() => o == null ? void 0 : o.destroy()), a(k, {
      data: n,
      update: (t) => e.component = t,
      destroy: () => e.component = void 0
    }), a(x, {
      data: n,
      update: (t) => e.tooltip = t,
      destroy: () => {
        e.tooltip = void 0;
      }
    }), a(A, {
      data: n,
      update: (t) => e.annotations = t,
      destroy: () => {
        e.annotations = void 0;
      }
    }), d({
      component: o
    }), (t, B) => (_(), h("div", {
      "data-vis-single-container": "",
      ref_key: "elRef",
      ref: i,
      class: "unovis-single-container"
    }, [
      C(t.$slots, "default")
    ], 512));
  }
});
export {
  b as default
};
//# sourceMappingURL=index.js.map
