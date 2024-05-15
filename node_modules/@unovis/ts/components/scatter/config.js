import { XYComponentDefaultConfig } from '../../core/xy-component/config.js';
import { Scale } from '../../types/scale.js';
import { SymbolType } from '../../types/symbol.js';
import { Position } from '../../types/position.js';

// Core
const ScatterDefaultConfig = Object.assign(Object.assign({}, XYComponentDefaultConfig), { color: (d) => d.color, size: 10, sizeScale: Scale.scaleSqrt(), sizeRange: undefined, shape: SymbolType.Circle, label: undefined, labelColor: undefined, labelPosition: Position.Bottom, labelHideOverlapping: true, cursor: null, labelTextBrightnessRatio: 0.65, strokeColor: undefined, strokeWidth: undefined });

export { ScatterDefaultConfig };
//# sourceMappingURL=config.js.map
