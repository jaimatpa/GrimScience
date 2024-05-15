import { getString } from '../../../utils/data.js';
import { getPointPos } from './utils.js';
import { pointSelection, pointSelectionRing } from '../style.js';

// Utils
function createNodeSelectionRing(selection) {
    selection.datum({ _zIndex: 3 });
    selection.append('path').attr('class', pointSelection);
}
function updateNodeSelectionRing(selection, selectedPoint, pointData, config, leafletMap) {
    selection.attr('class', pointSelectionRing);
    const pointSelection$1 = selection.select(`.${pointSelection}`);
    if (selectedPoint) {
        const isCluster = selectedPoint.isCluster;
        const selectedPointId = getString(selectedPoint.properties, config.pointId);
        const foundPoint = pointData.find(d => isCluster
            ? (d.id === selectedPoint.id)
            : (selectedPointId && (getString(d.properties, config.pointId) === selectedPointId)));
        selection
            .attr('transform', d => {
            const { x, y } = getPointPos(foundPoint !== null && foundPoint !== void 0 ? foundPoint : selectedPoint, leafletMap);
            return `translate(${x},${y})`;
        })
            .classed(`${selectedPoint.properties.shape}`, true);
        pointSelection$1
            .classed('active', Boolean(foundPoint))
            .attr('d', foundPoint ? foundPoint.path : null)
            .style('fill', 'transparent')
            .style('stroke-width', 1)
            .style('stroke', d => {
            const node = foundPoint || selectedPoint;
            return node === null || node === void 0 ? void 0 : node.color;
        });
    }
    else {
        pointSelection$1.classed('active', false);
    }
}

export { createNodeSelectionRing, updateNodeSelectionRing };
//# sourceMappingURL=selectionRing.js.map
