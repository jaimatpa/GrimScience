import { ComponentDefaultConfig } from '../../core/component/config.js';
import { ChordLabelAlignment } from './types.js';

// Core
const ChordDiagramDefaultConfig = Object.assign(Object.assign({}, ComponentDefaultConfig), { duration: 800, highlightedNodeId: undefined, highlightedLinkIds: [], linkColor: undefined, linkValue: (d) => d.value, nodeLevels: [], nodeWidth: 15, nodeColor: (d) => d.color, nodeLabel: (d) => { var _a; return (_a = d.label) !== null && _a !== void 0 ? _a : d.key; }, nodeLabelColor: undefined, nodeLabelAlignment: ChordLabelAlignment.Along, padAngle: 0.02, cornerRadius: 2, angleRange: [0, 2 * Math.PI], radiusScaleExponent: 2 });

export { ChordDiagramDefaultConfig };
//# sourceMappingURL=config.js.map
