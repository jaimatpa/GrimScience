import { wrapSVGText, trimSVGText, estimateTextSize } from '../../../utils/text.js';
import { smartTransition } from '../../../utils/d3.js';
import { getValue, getString } from '../../../utils/data.js';
import { getColor } from '../../../utils/color.js';
import { getCSSVariableValueInPixels } from '../../../utils/misc.js';
import { VerticalAlign, FitMode } from '../../../types/text.js';
import { Position } from '../../../types/position.js';
import { SankeySubLabelPlacement } from '../types.js';
import { label, sublabel, labelTrimmed, labelBackground } from '../style.js';

// Utils
const NODE_LABEL_SPACING = 10;
const LABEL_BLOCK_PADDING = 6.5;
function getLabelBackground(width, height, orientation, arrowWidth = 5, arrowHeight = 8) {
    const halfHeight = height / 2;
    const halfArrowHeight = arrowHeight / 2;
    if (orientation === Position.Left) {
        const rightArrowPos = `L 0 ${halfHeight - halfArrowHeight}   L   ${+arrowWidth} ${halfHeight} L 0 ${halfHeight + halfArrowHeight}`;
        return `
      M 0 0
      ${rightArrowPos}
      L 0  ${height}
      L ${-width} ${height}
      L ${-width} 0
      L 0 0 `;
    }
    else {
        const leftArrowPos = `L 0 ${halfHeight - halfArrowHeight}   L   ${-arrowWidth} ${halfHeight} L 0 ${halfHeight + halfArrowHeight}`;
        return `
      M 0 0
      ${leftArrowPos}
      L 0  ${height}
      L ${width} ${height}
      L ${width} 0
      L 0 0 `;
    }
}
function getLabelOrientation(d, sankeyWidth, labelPosition) {
    let orientation = getValue(d, labelPosition);
    if (orientation === Position.Auto || !orientation) {
        orientation = d.x0 < sankeyWidth / 2 ? Position.Left : Position.Right;
    }
    return orientation;
}
const requiredLabelSpace = (labelWidth, labelFontSize) => {
    return {
        height: labelFontSize * 2.5 + 2 * LABEL_BLOCK_PADDING,
        width: labelWidth + 2 * NODE_LABEL_SPACING + 2 * LABEL_BLOCK_PADDING,
    };
};
function getLabelGroupXTranslate(d, config, width) {
    const orientation = getLabelOrientation(d, width, config.labelPosition);
    switch (orientation) {
        case Position.Right: return config.nodeWidth + NODE_LABEL_SPACING;
        case Position.Left:
        default:
            return -NODE_LABEL_SPACING;
    }
}
function getLabelGroupYTranslate(d, labelGroupHeight, config) {
    const nodeHeight = d.y1 - d.y0;
    if (config.labelBackground && (nodeHeight < labelGroupHeight))
        return (nodeHeight - labelGroupHeight) / 2;
    switch (config.labelVerticalAlign) {
        case VerticalAlign.Bottom: return nodeHeight - labelGroupHeight;
        case VerticalAlign.Middle: return nodeHeight / 2 - labelGroupHeight / 2;
        case VerticalAlign.Top:
        default: return 0;
    }
}
function getLabelTextAnchor(d, config, width) {
    const orientation = getLabelOrientation(d, width, config.labelPosition);
    switch (orientation) {
        case Position.Right: return 'start';
        case Position.Left:
        default:
            return 'end';
    }
}
function getSubLabelTextAnchor(d, config, width) {
    const isSublabelInline = config.subLabelPlacement === SankeySubLabelPlacement.Inline;
    const orientation = getLabelOrientation(d, width, config.labelPosition);
    switch (orientation) {
        case Position.Right: return isSublabelInline ? 'end' : 'start';
        case Position.Left:
        default:
            return isSublabelInline ? 'start' : 'end';
    }
}
function renderLabel(labelGroup, d, config, width, duration, forceExpand = false) {
    var _a, _b;
    const labelTextSelection = labelGroup.select(`.${label}`);
    const labelShowBackground = config.labelBackground || forceExpand;
    const sublabelTextSelection = labelGroup.select(`.${sublabel}`);
    const labelPadding = labelShowBackground ? LABEL_BLOCK_PADDING : 0;
    const isSublabelInline = config.subLabelPlacement === SankeySubLabelPlacement.Inline;
    const separator = config.labelForceWordBreak ? '' : config.labelTextSeparator;
    const fastEstimatesMode = true; // Fast but inaccurate
    const fontWidthToHeightRatio = 0.52;
    const dy = 0.32;
    const labelOrientation = getLabelOrientation(d, width, config.labelPosition);
    const labelOrientationMult = labelOrientation === Position.Left ? -1 : 1;
    const labelText = getString(d, config.label);
    const sublabelText = getString(d, config.subLabel);
    let wasTrimmed = false;
    const labelFontSize = (_a = config.labelFontSize) !== null && _a !== void 0 ? _a : getCSSVariableValueInPixels('var(--vis-sankey-node-label-font-size)', labelGroup.node());
    const subLabelFontSize = (_b = config.subLabelFontSize) !== null && _b !== void 0 ? _b : getCSSVariableValueInPixels('var(--vis-sankey-node-sublabel-font-size)', labelGroup.node());
    // Render the main label, wrap / trim it and estimate its size
    const labelsFontSizeDifference = sublabelText ? labelFontSize - subLabelFontSize : 0;
    const labelTranslateY = labelPadding + ((isSublabelInline && labelsFontSizeDifference < 0) ? -0.6 * labelsFontSizeDifference : 0);
    labelTextSelection
        .text(labelText)
        .attr('font-size', labelFontSize)
        .style('fill', getColor(d, config.labelColor))
        .attr('transform', `translate(${labelOrientationMult * labelPadding},${labelTranslateY})`)
        .style('cursor', (d) => getString(d, config.labelCursor));
    const labelMaxWidth = isSublabelInline ? config.labelMaxWidth * (1 - (sublabelText ? config.subLabelToLabelInlineWidthRatio : 0)) : config.labelMaxWidth;
    if (config.labelFit === FitMode.Wrap || forceExpand)
        wrapSVGText(labelTextSelection, labelMaxWidth, separator);
    else
        wasTrimmed = trimSVGText(labelTextSelection, labelMaxWidth, config.labelTrimMode, fastEstimatesMode, labelFontSize, fontWidthToHeightRatio);
    const labelSize = estimateTextSize(labelTextSelection, labelFontSize, dy, fastEstimatesMode, fontWidthToHeightRatio);
    // Render the sub-label, wrap / trim it and estimate its size
    const sublabelTranslateX = labelOrientationMult * (labelPadding + (isSublabelInline ? config.labelMaxWidth : 0));
    const sublabelMarginTop = 0;
    const sublabelTranslateY = labelPadding + (isSublabelInline
        ? (labelsFontSizeDifference > 0 ? 0.6 * labelsFontSizeDifference : 0)
        : labelSize.height + sublabelMarginTop);
    sublabelTextSelection
        .text(sublabelText)
        .attr('font-size', subLabelFontSize)
        .style('fill', getColor(d, config.subLabelColor))
        .attr('transform', `translate(${sublabelTranslateX},${sublabelTranslateY})`)
        .style('cursor', (d) => getString(d, config.labelCursor));
    const sublabelMaxWidth = isSublabelInline ? config.labelMaxWidth * config.subLabelToLabelInlineWidthRatio : config.labelMaxWidth;
    if (config.labelFit === FitMode.Wrap || forceExpand)
        wrapSVGText(sublabelTextSelection, sublabelMaxWidth, separator);
    else
        wasTrimmed = wasTrimmed || trimSVGText(sublabelTextSelection, sublabelMaxWidth, config.labelTrimMode, fastEstimatesMode, subLabelFontSize, fontWidthToHeightRatio);
    labelGroup.classed(labelTrimmed, wasTrimmed);
    const sublabelSize = estimateTextSize(sublabelTextSelection, subLabelFontSize, dy, fastEstimatesMode, fontWidthToHeightRatio);
    // Draw the background if needed
    const labelGroupHeight = (isSublabelInline ? Math.max(labelSize.height, sublabelSize.height) : (labelSize.height + sublabelSize.height)) + 2 * labelPadding;
    const labelBackground$1 = labelGroup.select(`.${labelBackground}`);
    labelBackground$1
        .attr('d', labelShowBackground ? getLabelBackground(config.labelMaxWidth + 2 * labelPadding, labelGroupHeight, labelOrientation) : null);
    // Position the label
    const labelTextAnchor = getLabelTextAnchor(d, config, width);
    const sublabelTextAnchor = getSubLabelTextAnchor(d, config, width);
    const xTranslate = getLabelGroupXTranslate(d, config, width);
    const yTranslate = getLabelGroupYTranslate(d, labelGroupHeight, config);
    labelTextSelection.attr('text-anchor', labelTextAnchor);
    sublabelTextSelection.attr('text-anchor', sublabelTextAnchor);
    const hasTransform = !!labelGroup.attr('transform');
    smartTransition(labelGroup, hasTransform ? duration : 0)
        .attr('transform', `translate(${xTranslate},${yTranslate})`);
    return {
        x: d.x0 + xTranslate,
        y: d.y0 + yTranslate,
        width: config.labelMaxWidth,
        height: labelGroupHeight,
        layer: d.layer,
        selection: labelGroup,
    };
}

export { getLabelGroupXTranslate, getLabelGroupYTranslate, getLabelOrientation, getLabelTextAnchor, getSubLabelTextAnchor, renderLabel, requiredLabelSpace };
//# sourceMappingURL=label.js.map
