import { XYComponentDefaultConfig } from '../../core/xy-component/config.js';
import { Orientation } from '../../types/position.js';

const GroupedBarDefaultConfig = Object.assign(Object.assign({}, XYComponentDefaultConfig), { color: undefined, groupMaxWidth: undefined, groupWidth: undefined, dataStep: undefined, groupPadding: 0.05, barPadding: 0.0, roundedCorners: 2, barMinHeight: 2, cursor: null, orientation: Orientation.Vertical });

export { GroupedBarDefaultConfig };
//# sourceMappingURL=config.js.map
