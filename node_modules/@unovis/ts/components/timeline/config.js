import { XYComponentDefaultConfig } from '../../core/xy-component/config.js';

const TimelineDefaultConfig = Object.assign(Object.assign({}, XYComponentDefaultConfig), { id: undefined, color: (d) => d.color, lineWidth: 8, lineCap: false, rowHeight: 22, length: (d) => d.length, type: (d) => d.type, cursor: null, labelWidth: undefined, showLabels: false, maxLabelWidth: 120, alternatingRowColors: true, onScroll: undefined, showEmptySegments: false });

export { TimelineDefaultConfig };
//# sourceMappingURL=config.js.map
