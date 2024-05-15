import { sankeyLeft, sankeyRight, sankeyCenter, sankeyJustify } from 'd3-sankey';

/* eslint-disable no-use-before-define */
var SankeySubLabelPlacement;
(function (SankeySubLabelPlacement) {
    SankeySubLabelPlacement["Inline"] = "inline";
    SankeySubLabelPlacement["Below"] = "below";
})(SankeySubLabelPlacement || (SankeySubLabelPlacement = {}));
var SankeyNodeAlign;
(function (SankeyNodeAlign) {
    SankeyNodeAlign["Left"] = "left";
    SankeyNodeAlign["Right"] = "right";
    SankeyNodeAlign["Center"] = "center";
    SankeyNodeAlign["Justify"] = "justify";
})(SankeyNodeAlign || (SankeyNodeAlign = {}));
const SankeyLayout = {
    [SankeyNodeAlign.Left]: sankeyLeft,
    [SankeyNodeAlign.Right]: sankeyRight,
    [SankeyNodeAlign.Center]: sankeyCenter,
    [SankeyNodeAlign.Justify]: sankeyJustify,
};
var SankeyExitTransitionType;
(function (SankeyExitTransitionType) {
    SankeyExitTransitionType["Default"] = "default";
    SankeyExitTransitionType["ToAncestor"] = "to ancestor";
})(SankeyExitTransitionType || (SankeyExitTransitionType = {}));
var SankeyEnterTransitionType;
(function (SankeyEnterTransitionType) {
    SankeyEnterTransitionType["Default"] = "default";
    SankeyEnterTransitionType["FromAncestor"] = "from ancestor";
})(SankeyEnterTransitionType || (SankeyEnterTransitionType = {}));

export { SankeyEnterTransitionType, SankeyExitTransitionType, SankeyLayout, SankeyNodeAlign, SankeySubLabelPlacement };
//# sourceMappingURL=types.js.map
