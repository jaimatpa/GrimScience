import { XYComponentDefaultConfig } from '../../core/xy-component/config.js';

const CrosshairDefaultConfig = Object.assign(Object.assign({}, XYComponentDefaultConfig), { yStacked: undefined, baseline: null, duration: 100, tooltip: undefined, template: (d, x) => '', hideWhenFarFromPointer: true, hideWhenFarFromPointerDistance: 100, snapToData: true, getCircles: undefined, color: undefined, strokeColor: undefined, strokeWidth: undefined });

export { CrosshairDefaultConfig };
//# sourceMappingURL=config.js.map
