import { interpolate } from 'd3-interpolate';
import { getColor } from '../../../utils/color.js';
import { smartTransition } from '../../../utils/d3.js';

function createArc(selection, config) {
    selection
        .style('fill', d => getColor(d.data, config.color, d.index))
        .style('opacity', 0)
        .each((d, i, els) => {
        const arcNode = els[i];
        const angleCenter = (d.startAngle + d.endAngle) / 2;
        const angleHalfWidth = (d.endAngle - d.startAngle) / 2;
        arcNode._animState = {
            startAngle: angleCenter - angleHalfWidth,
            endAngle: angleCenter + angleHalfWidth,
            innerRadius: d.innerRadius,
            outerRadius: d.outerRadius,
            padAngle: d.padAngle,
        };
    });
}
function updateArc(selection, config, arcGen, duration) {
    selection
        .style('transition', `fill ${duration}ms`) // Animate color with CSS because we're using CSS-variables
        .style('fill', d => getColor(d.data, config.color, d.index));
    const setOpacity = (d) => (config.showEmptySegments || d.value) ? 1 : 0;
    if (duration) {
        const transition = smartTransition(selection, duration)
            .style('opacity', setOpacity);
        transition.attrTween('d', (d, i, els) => {
            const arcNode = els[i];
            const nextAnimState = {
                startAngle: d.startAngle,
                endAngle: d.endAngle,
                innerRadius: d.innerRadius,
                outerRadius: d.outerRadius,
                padAngle: d.padAngle,
            };
            const datum = interpolate(arcNode._animState, nextAnimState);
            return (t) => {
                arcNode._animState = datum(t);
                return arcGen(arcNode._animState);
            };
        });
    }
    else {
        selection
            .attr('d', arcGen)
            .style('opacity', setOpacity);
    }
}
function removeArc(selection, duration) {
    smartTransition(selection, duration)
        .style('opacity', 0)
        .remove();
}

export { createArc, removeArc, updateArc };
//# sourceMappingURL=arc.js.map
