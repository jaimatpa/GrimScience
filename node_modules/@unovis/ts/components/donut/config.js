import { ComponentDefaultConfig } from '../../core/component/config.js';

// Core
const DonutDefaultConfig = Object.assign(Object.assign({}, ComponentDefaultConfig), { id: (d, i) => { var _a; return (_a = d.id) !== null && _a !== void 0 ? _a : i; }, value: undefined, angleRange: [0, 2 * Math.PI], padAngle: 0, sortFunction: undefined, cornerRadius: 0, color: undefined, radius: undefined, arcWidth: 20, centralLabel: undefined, centralSubLabel: undefined, centralSubLabelWrap: true, showEmptySegments: false, emptySegmentAngle: 0.5 * Math.PI / 180, showBackground: true, backgroundAngleRange: undefined });

export { DonutDefaultConfig };
//# sourceMappingURL=config.js.map
