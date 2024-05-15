import _forEach from 'lodash-es/forEach';
import _sortBy from 'lodash-es/sortBy';
import _flatten from 'lodash-es/flatten';
import _map from 'lodash-es/map';
import _zipObject from 'lodash-es/zipObject';

/*
 * A function that takes a layering (an array of layers, each with an array of
 * ordererd nodes) and a graph and returns a weighted crossing count.
 *
 * Pre-conditions:
 *
 *    1. Input graph must be simple (not a multigraph), directed, and include
 *       only simple edges.
 *    2. Edges in the input graph must have assigned weights.
 *
 * Post-conditions:
 *
 *    1. The graph and layering matrix are left unchanged.
 *
 * This algorithm is derived from Barth, et al., "Bilayer Cross Counting."
 */
function crossCount (g, layering) {
  let cc = 0;

  for (let i = 1; i < layering.length; ++i) {
    cc += twoLayerCrossCount(g, layering[i - 1], layering[i]);
  }

  return cc
}

function twoLayerCrossCount (g, northLayer, southLayer) {
  // Sort all of the edges between the north and south layers by their position
  // in the north layer and then the south. Map these edges to the position of
  // their head in the south layer.
  const southPos = _zipObject(southLayer, _map(southLayer, function (v, i) {
    return i
  }));

  const southEntries = _flatten(_map(northLayer, function (v) {
    const outEdges = g.outEdges(v);

    const pos = _map(outEdges, e => ({
      pos: southPos[e.w],
      weight: g.edge(e).weight
    }));

    const posSorted = _sortBy(pos, 'pos');

    return posSorted
  }), true); // Build the accumulator tree

  let firstIndex = 1;

  while (firstIndex < southLayer.length) {
    firstIndex <<= 1;
  }

  const treeSize = 2 * firstIndex - 1;
  firstIndex -= 1;

  const tree = _map(new Array(treeSize), function () {
    return 0
  }); // Calculate the weighted crossings

  let cc = 0;

  _forEach(southEntries.forEach(function (entry) {
    let index = entry.pos + firstIndex;
    tree[index] += entry.weight;
    let weightSum = 0;

    while (index > 0) {
      if (index % 2) {
        weightSum += tree[index + 1];
      }

      index = index - 1 >> 1;
      tree[index] += entry.weight;
    }

    cc += entry.weight * weightSum;
  }));

  return cc
}

export { crossCount as default };
//# sourceMappingURL=cross-count.js.map
