import { pie, arc } from 'd3-shape';

const pieConstructor = pie()
    .sort(null)
    .value((d) => d.value);
function updateDonut(selection, data, radius, arcWidth = 2, padAngle = 0.05) {
    pieConstructor.padAngle(padAngle);
    const arcs = pieConstructor(data.filter(d => d.value));
    const arcPathGen = arc()
        .innerRadius(arcWidth ? radius - arcWidth / 2 : 0)
        .outerRadius(arcWidth ? radius + arcWidth / 2 : radius);
    const donuts = selection.selectAll('path')
        .data(arcs);
    donuts.exit().remove();
    donuts.enter()
        .append('path')
        .merge(donuts)
        .attr('class', d => { var _a; return (_a = d.data.className) !== null && _a !== void 0 ? _a : null; })
        .attr('d', arcPathGen)
        .style('fill', d => { var _a; return (_a = d.data.color) !== null && _a !== void 0 ? _a : null; })
        .style('stroke', d => { var _a; return (_a = d.data.color) !== null && _a !== void 0 ? _a : null; });
}

export { updateDonut };
//# sourceMappingURL=donut.js.map
