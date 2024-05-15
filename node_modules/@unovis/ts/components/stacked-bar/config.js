import { XYComponentDefaultConfig } from '../../core/xy-component/config.js';
import { Orientation } from '../../types/position.js';

const StackedBarDefaultConfig = Object.assign(Object.assign({}, XYComponentDefaultConfig), { color: undefined, barMaxWidth: undefined, barWidth: undefined, dataStep: undefined, barPadding: 0.0, roundedCorners: 2, cursor: null, barMinHeight1Px: false, barMinHeightZeroValue: null, orientation: Orientation.Vertical });

export { StackedBarDefaultConfig };
//# sourceMappingURL=config.js.map
