import { defineComponent as u, toRefs as y, ref as p, reactive as v, watch as f, watchEffect as x, toRaw as r, onMounted as h, onUnmounted as D, provide as a, openBlock as g, createElementBlock as A, renderSlot as C } from "vue";
import { XYContainer as w } from "@unovis/ts";
import { componentAccessorKey as B, axisAccessorKey as M, crosshairAccessorKey as R, tooltipAccessorKey as _, annotationsAccessorKey as K } from "../../utils/context.js";
import { useForwardProps as b } from "../../utils/props.js";
const $ = /* @__PURE__ */ u({
  __name: "index",
  props: {
    components: {},
    xScale: { type: [Object, Function] },
    xDomain: {},
    xDomainMinConstraint: {},
    xDomainMaxConstraint: {},
    xRange: {},
    yScale: { type: [Object, Function] },
    yDomain: {},
    yDomainMinConstraint: {},
    yDomainMaxConstraint: {},
    yRange: {},
    yDirection: {},
    xAxis: {},
    yAxis: {},
    autoMargin: { type: Boolean },
    tooltip: {},
    crosshair: {},
    preventEmptyDomain: { type: [Boolean, null] },
    scaleByDomain: { type: Boolean },
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
  setup(d, { expose: l }) {
    const c = d, { data: t } = y(c), m = b(c), n = p(), e = v({
      components: [],
      annotations: void 0,
      crosshair: void 0,
      tooltip: void 0,
      xAxis: void 0,
      yAxis: void 0
    }), s = p();
    return f(t, () => {
      n.value && n.value.setData(t.value, !0);
    }), x(() => {
      var o;
      e.components.map((i) => i.config), (o = n.value) == null || o.updateContainer({ ...r(m.value), ...r(e) });
    }), h(() => {
      s.value && (n.value = new w(s.value, { ...r(e) }, t.value));
    }), D(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.destroy();
    }), a(B, {
      data: t,
      update: (o) => e.components = [...e.components, o],
      destroy: () => {
        var o;
        return e.components = (o = e.components) == null ? void 0 : o.filter((i) => !i.isDestroyed());
      }
    }), a(M, {
      data: t,
      update: (o) => e[`${o.config.type}Axis`] = o,
      destroy: (o) => {
        e[`${o}Axis`] = void 0;
      }
    }), a(R, {
      data: t,
      update: (o) => e.crosshair = o,
      destroy: () => {
        e.crosshair = void 0;
      }
    }), a(_, {
      data: t,
      update: (o) => e.tooltip = o,
      destroy: () => {
        e.tooltip = void 0;
      }
    }), a(K, {
      data: t,
      update: (o) => e.annotations = o,
      destroy: () => {
        e.annotations = void 0;
      }
    }), l({
      component: n
    }), (o, i) => (g(), A("div", {
      "data-vis-xy-container": "",
      ref_key: "elRef",
      ref: s,
      class: "unovis-xy-container"
    }, [
      C(o.$slots, "default")
    ], 512));
  }
});
export {
  $ as default
};
//# sourceMappingURL=index.js.map
