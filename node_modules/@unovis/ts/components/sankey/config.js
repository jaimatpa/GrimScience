import { ComponentDefaultConfig } from '../../core/component/config.js';
import { getNumber } from '../../utils/data.js';
import { VerticalAlign, FitMode, TrimMode } from '../../types/text.js';
import { Position } from '../../types/position.js';
import { SankeyExitTransitionType, SankeyEnterTransitionType, SankeyNodeAlign, SankeySubLabelPlacement } from './types.js';

// Config
const SankeyDefaultConfig = (Object.assign(Object.assign({}, ComponentDefaultConfig), { heightNormalizationCoeff: 1 / 16, exitTransitionType: SankeyExitTransitionType.Default, enterTransitionType: SankeyEnterTransitionType.Default, id: (d, i) => { var _a; return (_a = d._id) !== null && _a !== void 0 ? _a : `${i}`; }, highlightSubtreeOnHover: false, highlightDuration: 300, highlightDelay: 1000, iterations: 32, nodeSort: undefined, nodeWidth: 25, nodeAlign: SankeyNodeAlign.Justify, nodeHorizontalSpacing: 150, nodeMinHeight: 20, nodeMaxHeight: 100, nodePadding: 2, nodeColor: (d) => d.color, nodeFixedValue: (d) => d.fixedValue, showSingleNode: true, nodeCursor: undefined, nodeIcon: undefined, nodeIconColor: undefined, label: (d) => d.label, labelPosition: Position.Auto, labelVerticalAlign: VerticalAlign.Middle, labelBackground: false, labelTextSeparator: [' ', '-'], labelFit: FitMode.Trim, labelTrimMode: TrimMode.Middle, labelForceWordBreak: true, labelFontSize: undefined, labelCursor: undefined, labelColor: undefined, labelMaxWidth: 70, labelExpandTrimmedOnHover: true, labelVisibility: undefined, subLabel: undefined, subLabelFontSize: undefined, subLabelColor: undefined, subLabelPlacement: SankeySubLabelPlacement.Below, subLabelToLabelInlineWidthRatio: 0.4, linkValue: (d) => d.value, linkColor: (d) => d.color, linkCursor: undefined, 
    // https://stackoverflow.com/a/21648197/2040291
    init: function () {
        this.linkSort =
            (link2, link1) => getNumber(link1, this.linkValue) - getNumber(link2, this.linkValue);
        delete this.init;
        return this;
    } })).init();

export { SankeyDefaultConfig };
//# sourceMappingURL=config.js.map
