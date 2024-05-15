import { interpolate } from 'd3-interpolate';
import { getColor } from '../../../utils/color.js';
import { smartTransition } from '../../../utils/d3.js';

function createArc(selection, config) {
    selection
        .style('fill', d => { var _a, _b; return (_a = getColor(d, config.segmentColor)) !== null && _a !== void 0 ? _a : (_b = d._state) === null || _b === void 0 ? void 0 : _b.fill; })
        .style('opacity', 0)
        .each((d, i, els) => {
        const arcNode = els[i];
        const angleCenter = (d.x0 + d.x1) / 2;
        const angleHalfWidth = (d.x1 - d.x0) / 2;
        arcNode._animState = {
            x0: angleCenter - angleHalfWidth,
            x1: angleCenter + angleHalfWidth,
            y0: d.y0,
            y1: d.y1,
        };
    });
}
function updateArc(selection, config, arcGen, duration) {
    selection
        .style('transition', `fill ${duration}ms`) // Animate color with CSS because we're using CSS-variables
        .style('fill', d => d._state.fill)
        .style('fill-opacity', d => d._state.fillOpacity);
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
        selection.attr('d', arcGen)
            .style('opacity', 1);
    }
}
function removeArc(selection, duration) {
    smartTransition(selection, duration)
        .style('opacity', 0)
        .remove();
}

export { createArc, removeArc, updateArc };
//# sourceMappingURL=arc.js.map
