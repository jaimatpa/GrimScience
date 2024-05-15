import { cloneDeep } from '../../../utils/data.js';
import { getPointPos, getNodePathData } from './utils.js';
import { LeafletMapPointShape } from '../types.js';

// Utils
function createBackgroundNode(selection) {
    selection.datum({ _zIndex: 1 });
    selection.append('path');
}
function updateBackgroundNode(selection, expandedCluster, config, leafletMap, clusterBackgroundRadius) {
    const { clusterBackground } = config;
    if (expandedCluster && clusterBackground) {
        const node = cloneDeep(expandedCluster.cluster);
        const { x, y } = getPointPos(node, leafletMap);
        const path = getNodePathData({ x: 0, y: 0 }, clusterBackgroundRadius, LeafletMapPointShape.Circle);
        selection.select('path').attr('d', d => path);
        selection
            .classed('active', true)
            .attr('transform', `translate(${x},${y})`);
    }
    else {
        selection.classed('active', false);
    }
}

export { createBackgroundNode, updateBackgroundNode };
//# sourceMappingURL=clusterBackground.js.map
