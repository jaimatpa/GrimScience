import { isEqual as p } from "@unovis/ts";
import { getCurrentInstance as a, computed as u, camelize as s } from "vue";
function f(t, r) {
  return p(t, r);
}
function m(t) {
  const r = a(), n = r.attrs;
  return u(() => {
    const o = {}, c = (r == null ? void 0 : r.vnode.props) ?? {};
    return Object.keys(c).forEach((e) => {
      o[s(e)] = t[s(e)];
    }), { ...o, ...n };
  });
}
export {
  f as arePropsEqual,
  m as useForwardProps
};
//# sourceMappingURL=props.js.map
