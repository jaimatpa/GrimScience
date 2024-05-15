import { XYComponentDefaultConfig } from '../../core/xy-component/config.js';
import { TrimMode, FitMode } from '../../types/text.js';

const AxisDefaultConfig = Object.assign(Object.assign({}, XYComponentDefaultConfig), { position: undefined, type: undefined, label: undefined, labelFontSize: null, gridLine: true, tickLine: true, domainLine: true, numTicks: undefined, minMaxTicksOnly: false, tickTextWidth: undefined, tickTextSeparator: undefined, tickTextForceWordBreak: false, tickTextTrimType: TrimMode.Middle, tickTextFitMode: FitMode.Wrap, tickTextFontSize: null, tickTextAlign: undefined, tickTextColor: null, labelMargin: 8, labelColor: null, tickFormat: undefined, tickValues: undefined, fullSize: true, tickPadding: 8 });

export { AxisDefaultConfig };
//# sourceMappingURL=config.js.map
