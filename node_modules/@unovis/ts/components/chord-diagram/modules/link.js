import { select } from 'd3-selection';
import { ribbon } from 'd3-chord';
import { areaRadial } from 'd3-shape';
import { interpolatePath } from 'd3-interpolate-path';
import { Curve } from '../../../types/curve.js';
import { getColor } from '../../../utils/color.js';
import { smartTransition } from '../../../utils/d3.js';
import { convertLineToArc } from '../../../utils/path.js';

// Generators
function emptyPath() {
    return 'M0,0 L0,0';
}
// Generators
const ribbonGen = ribbon()
    .source(d => d[0])
    .target(d => d[d.length - 1])
    .startAngle(d => d.a0)
    .endAngle(d => d.a1);
const areaGen = areaRadial()
    .curve(Curve.catmullRom.alpha(0.5))
    .startAngle((d, i, points) => i < points.length / 2 ? d.a1 : d.a0)
    .endAngle((d, i, points) => i < points.length / 2 ? d.a0 : d.a1);
// Creates a path from set of points
function linkGen(points, radiusScale) {
    var _a;
    const link = (points.length === 2 ? ribbonGen : areaGen);
    link.radius(d => radiusScale(d.r));
    const linkPath = link(points);
    if (points.length === 2)
        return linkPath;
    // Replace closePath with line to starting point
    const area = linkPath.slice(0, -1);
    const path = area.concat(`L${(_a = area.match(/M-?\d*\.?\d*[,\s*]-?\d*\.?\d*/)) === null || _a === void 0 ? void 0 : _a[0].slice(1)}`);
    // Convert line edges to arcs
    const radius = Math.max(radiusScale(points[0].r), 0);
    return convertLineToArc(path, radius);
}
function createLink(selection, radiusScale) {
    selection
        .attr('d', d => linkGen(d.points, radiusScale) || emptyPath())
        .style('opacity', 0);
}
function updateLink(selection, config, radiusScale, duration) {
    selection
        .style('transition', `fill ${duration}ms`)
        .style('fill', d => getColor(d.data, config.linkColor))
        .style('stroke', d => getColor(d.data, config.linkColor));
    const transition = smartTransition(selection, duration)
        .style('opacity', 1);
    if (duration) {
        transition.attrTween('d', (d, i, el) => {
            const previous = select(el[i]).attr('d');
            const next = linkGen(d.points, radiusScale) || emptyPath();
            return interpolatePath(previous, next);
        });
    }
    else {
        transition.attr('d', d => linkGen(d.points, radiusScale) || emptyPath());
    }
}
function removeLink(selection, duration) {
    smartTransition(selection, duration)
        .style('opacity', 0)
        .remove();
}

export { createLink, emptyPath, removeLink, updateLink };
//# sourceMappingURL=link.js.map
