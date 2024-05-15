import { select } from 'd3-selection';
import { getColor } from '../../../utils/color.js';
import { getString } from '../../../utils/data.js';
import { smartTransition } from '../../../utils/d3.js';
import { SankeyEnterTransitionType, SankeyNodeAlign, SankeyExitTransitionType } from '../types.js';
import { renderLabel } from './label.js';
import { node, labelGroup, labelBackground, label, sublabel, nodeIcon, SANKEY_ICON_SIZE, hidden, labelTrimmed, forceShow } from '../style.js';

function createNodes(sel, config, width, bleed) {
    const { enterTransitionType } = config;
    // Node
    sel.append('rect')
        .attr('class', node)
        .attr('width', config.nodeWidth)
        .attr('height', d => d.y1 - d.y0)
        .style('fill', node => getColor(node, config.nodeColor));
    // Labels
    const labelGroup$1 = sel.append('g').attr('class', labelGroup);
    labelGroup$1.append('path').attr('class', labelBackground);
    labelGroup$1.append('text').attr('class', label);
    labelGroup$1.append('text').attr('class', sublabel);
    // Node icon
    sel.append('text').attr('class', nodeIcon)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.5px');
    sel
        .attr('transform', d => {
        var _a;
        const x = (enterTransitionType === SankeyEnterTransitionType.FromAncestor && ((_a = d.targetLinks) === null || _a === void 0 ? void 0 : _a[0])) ? d.targetLinks[0].source.x0 : d.x0;
        return `translate(${sel.size() === 1 ? width * 0.5 - bleed.left : x}, ${d.y0})`;
    })
        .style('opacity', 0);
}
function getNodeXPos(d, config, width, bleed, hasLinks) {
    if (hasLinks)
        return d.x0;
    switch (config.nodeAlign) {
        case SankeyNodeAlign.Left: return d.x0;
        case SankeyNodeAlign.Right: return width - bleed.right;
        case SankeyNodeAlign.Center:
        case SankeyNodeAlign.Justify:
        default: return width * 0.5 - bleed.left;
    }
}
function updateNodes(sel, config, width, bleed, hasLinks, duration) {
    smartTransition(sel, duration)
        .attr('transform', d => `translate(${getNodeXPos(d, config, width, bleed, hasLinks)},${d.y0})`)
        .style('opacity', d => d._state.greyout ? 0.2 : 1);
    // Node
    smartTransition(sel.select(`.${node}`), duration)
        .attr('width', config.nodeWidth)
        .attr('height', (d) => d.y1 - d.y0)
        .style('cursor', (d) => getString(d, config.nodeCursor))
        .style('fill', (d) => getColor(d, config.nodeColor));
    // Label Rendering
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    renderNodeLabels(sel, config, width, duration);
    // Node Icon
    const nodeIcon$1 = sel.select(`.${nodeIcon}`);
    if (config.nodeIcon) {
        nodeIcon$1
            .attr('visibility', null)
            .attr('text-anchor', 'middle')
            .style('dominant-baseline', 'central')
            .style('stroke', (d) => getColor(d, config.nodeIconColor))
            .style('fill', (d) => getColor(d, config.nodeIconColor))
            .style('font-size', (d) => {
            const nodeHeight = d.y1 - d.y0;
            return nodeHeight < SANKEY_ICON_SIZE ? `${nodeHeight * 0.65}px` : null;
        })
            .html((d) => getString(d, config.nodeIcon));
        smartTransition(nodeIcon$1, duration)
            .attr('x', config.nodeWidth / 2)
            .attr('y', (d) => (d.y1 - d.y0) / 2);
    }
    else {
        nodeIcon$1
            .attr('visibility', 'hidden');
    }
}
function renderNodeLabels(sel, config, width, duration, enforceNodeVisibility) {
    // Label Rendering
    const labelGroupSelection = sel.select(`.${labelGroup}`);
    const labelGroupEls = labelGroupSelection.nodes() || [];
    // After rendering Label return a BBox so we can do intersection detection and hide some of tem
    const labelGroupBBoxes = labelGroupEls.map(g => {
        const gSelection = select(g);
        const datum = gSelection.datum();
        return renderLabel(gSelection, datum, config, width, duration, enforceNodeVisibility === datum);
    });
    if (config.labelVisibility) {
        for (const b of labelGroupBBoxes) {
            const datum = b.selection.datum();
            const box = { x: b.x, y: b.y, width: b.width, height: b.height };
            b.hidden = !config.labelVisibility(datum, box, enforceNodeVisibility === datum);
        }
    }
    else {
        // Detect intersecting labels
        const maxLayer = Math.max(...labelGroupBBoxes.map(b => b.layer));
        for (let layer = 0; layer <= maxLayer; layer += 1) {
            const boxes = labelGroupBBoxes.filter(b => (b.layer === layer));
            boxes.sort((a, b) => a.y - b.y);
            let lastVisibleIdx = 0;
            for (let i = 1; i < boxes.length; i += 1) {
                const b0 = boxes[lastVisibleIdx];
                const b1 = boxes[i];
                const shouldBeHidden = b1.y < (b0.y + b0.height);
                if (shouldBeHidden) {
                    if (b1.selection.datum() === enforceNodeVisibility)
                        b0.hidden = true; // If the hovered node should be hidden, hide the previous one instead
                    else
                        b1.hidden = true;
                }
                if (!b1.hidden)
                    lastVisibleIdx = i;
            }
        }
    }
    // Hide intersecting labels
    for (const b of labelGroupBBoxes) {
        b.selection.classed(hidden, b.hidden);
    }
}
function removeNodes(selection, config, duration) {
    const { exitTransitionType } = config;
    selection.each((d, i, els) => {
        var _a;
        const node = select(els[i]);
        const transition = smartTransition(node, duration);
        if ((exitTransitionType === SankeyExitTransitionType.ToAncestor) && ((_a = d.targetLinks) === null || _a === void 0 ? void 0 : _a[0])) {
            transition.attr('transform', `translate(${d.targetLinks[0].source.x0},${d.y0})`);
        }
        transition
            .style('opacity', 0)
            .remove();
    });
}
function onNodeMouseOver(d, nodeSelection, config, width) {
    const labelGroup$1 = nodeSelection.raise()
        .select(`.${labelGroup}`);
    if ((config.labelExpandTrimmedOnHover && labelGroup$1.classed(labelTrimmed)) || labelGroup$1.classed(hidden)) {
        renderLabel(labelGroup$1, d, config, width, 0, true);
    }
    labelGroup$1.classed(forceShow, true);
}
function onNodeMouseOut(d, nodeSelection, config, width) {
    const labelGroup$1 = nodeSelection.select(`.${labelGroup}`);
    if (config.labelExpandTrimmedOnHover || labelGroup$1.classed(hidden)) {
        renderLabel(labelGroup$1, d, config, width, 0);
    }
    labelGroup$1.classed(forceShow, false);
}

export { createNodes, onNodeMouseOut, onNodeMouseOver, removeNodes, renderNodeLabels, updateNodes };
//# sourceMappingURL=node.js.map
