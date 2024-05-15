import { ComponentDefaultConfig } from '../component/config.js';

// Config
const XYComponentDefaultConfig = Object.assign(Object.assign({}, ComponentDefaultConfig), { x: undefined, y: undefined, id: (d, i) => { var _a; return (_a = d.id) !== null && _a !== void 0 ? _a : `${i}`; }, color: (d) => d.color, xScale: undefined, yScale: undefined, excludeFromDomainCalculation: false });

export { XYComponentDefaultConfig };
//# sourceMappingURL=config.js.map
