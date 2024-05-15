import { interpolate } from 'd3-interpolate';
import { getColor } from '../../../utils/color.js';
import { smartTransition } from '../../../utils/d3.js';

function createNode(selection) {
    selection
        .style('opacity', 0)
        .each((d, i, els) => {
        const arcNode = els[i];
        const angleCenter = (d.x0 + d.x1) / 2;
        const angleHalfWidth = (d.x1 - d.x0) / 2;
        arcNode._animState = {
            x0: angleCenter - angleHalfWidth * 0.8,
            x1: angleCenter + angleHalfWidth * 0.8,
            y0: d.y0,
            y1: d.y1,
        };
    });
}
function updateNode(selection, config, arcGen, duration) {
    const nodeColor = (d) => getColor(d.data, config.nodeColor, d.height);
    selection
        .attr('id', d => d.uid)
        .style('transition', `fill ${duration}ms`) // Animate color with CSS because we're using CSS-variables
        .style('fill', nodeColor)
        .style('stroke', nodeColor);
    if (duration) {
        const transition = smartTransition(selection, duration)
            .style('opacity', 1);
        transition.attrTween('d', (d, i, els) => {
            const arcNode = els[i];
            const nextAnimState = { x0: d.x0, x1: d.x1, y0: d.y0, y1: d.y1 };
            const datum = interpolate(arcNode._animState, nextAnimState);
            return (t) => {
                arcNode._animState = datum(t);
                return arcGen(arcNode._animState);
            };
        });
    }
    else {
        selection.attr('d', d => arcGen(d))
            .style('opacity', 1);
    }
}
function removeNode(selection, duration) {
    smartTransition(selection, duration)
        .style('opacity', 0)
        .remove();
}

export { createNode, removeNode, updateNode };
//# sourceMappingURL=node.js.map
