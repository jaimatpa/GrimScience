import { XYComponentDefaultConfig } from '../../core/xy-component/config.js';
import { CurveType } from '../../types/curve.js';

const AreaDefaultConfig = Object.assign(Object.assign({}, XYComponentDefaultConfig), { color: undefined, curveType: CurveType.MonotoneX, baseline: () => 0, opacity: 1, cursor: null, minHeight1Px: false });

export { AreaDefaultConfig };
//# sourceMappingURL=config.js.map
