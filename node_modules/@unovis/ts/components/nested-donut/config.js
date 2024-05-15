import { ComponentDefaultConfig } from '../../core/component/config.js';
import { NestedDonutDirection } from './types.js';

// Core
const NestedDonutDefaultConfig = Object.assign(Object.assign({}, ComponentDefaultConfig), { angleRange: [0, 2 * Math.PI], centralLabel: undefined, centralSubLabel: undefined, centralSubLabelWrap: true, cornerRadius: 0, direction: NestedDonutDirection.Inwards, emptySegmentAngle: Math.PI / 180, hideOverflowingSegmentLabels: true, layers: [], layerPadding: 0, layerSettings: undefined, segmentColor: undefined, segmentLabel: undefined, segmentLabelColor: undefined, showBackground: false, showEmptySegments: false, showSegmentLabels: true, sort: undefined, value: undefined });

export { NestedDonutDefaultConfig };
//# sourceMappingURL=config.js.map
