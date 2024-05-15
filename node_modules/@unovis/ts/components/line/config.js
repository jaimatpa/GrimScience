import { XYComponentDefaultConfig } from '../../core/xy-component/config.js';
import { CurveType } from '../../types/curve.js';

const LineDefaultConfig = Object.assign(Object.assign({}, XYComponentDefaultConfig), { curveType: CurveType.MonotoneX, lineWidth: 2, lineDashArray: undefined, fallbackValue: undefined, highlightOnHover: false, cursor: null });

export { LineDefaultConfig };
//# sourceMappingURL=config.js.map
