import { XYComponentDefaultConfig } from '../../core/xy-component/config.js';
import { XYLabelPositioning } from './types.js';

// Core
const XYLabelsDefaultConfig = Object.assign(Object.assign({}, XYComponentDefaultConfig), { color: (d) => d.color, y: undefined, xPositioning: XYLabelPositioning.DataSpace, yPositioning: XYLabelPositioning.DataSpace, labelFontSize: undefined, label: undefined, backgroundColor: undefined, cursor: null, labelTextBrightnessRatio: 0.65, clustering: true, clusterLabel: (records) => records.length.toString(), clusterFontSize: undefined, clusterBackgroundColor: undefined, clusterCursor: undefined, clusterLabelColor: null });

export { XYLabelsDefaultConfig };
//# sourceMappingURL=config.js.map
