import _forEach from 'lodash-es/forEach';
import _map from 'lodash-es/map';
import _cloneDeep from 'lodash-es/cloneDeep';
import _range from 'lodash-es/range';
import { Graph } from '@unovis/graphlibrary';
import initOrder from './init-order.js';
import crossCount from './cross-count.js';
import sortSubgraph from './sort-subgraph.js';
import buildLayerGraph from './build-layer-graph.js';
import addSubgraphConstraints from './add-subgraph-constraints.js';
import util from '../util.js';

/*
 * Applies heuristics to minimize edge crossings in the graph and sets the best
 * order solution as an order attribute on each node.
 *
 * Pre-conditions:
 *
 *    1. Graph must be DAG
 *    2. Graph nodes must be objects with a "rank" attribute
 *    3. Graph edges must have the "weight" attribute
 *
 * Post-conditions:
 *
 *    1. Graph nodes will have an "order" attribute based on the results of the
 *       algorithm.
 */

function order (g) {
  const maxRank = util.maxRank(g);
  const downLayerGraphs = buildLayerGraphs(g, _range(1, maxRank + 1), 'inEdges');
  const upLayerGraphs = buildLayerGraphs(g, _range(maxRank - 1, -1, -1), 'outEdges');
  let layering = initOrder(g);
  assignOrder(g, layering);
  let bestCC = Number.POSITIVE_INFINITY;
  let best;

  for (let i = 0, lastBest = 0; lastBest < 4; ++i, ++lastBest) {
    sweepLayerGraphs(i % 2 ? downLayerGraphs : upLayerGraphs, i % 4 >= 2);
    layering = util.buildLayerMatrix(g);
    const cc = crossCount(g, layering);

    if (cc < bestCC) {
      lastBest = 0;
      best = _cloneDeep(layering);
      bestCC = cc;
    }
  }

  assignOrder(g, best);
}

function buildLayerGraphs (g, ranks, relationship) {
  return _map(ranks, function (rank) {
    return buildLayerGraph(g, rank, relationship)
  })
}

function sweepLayerGraphs (layerGraphs, biasRight) {
  const cg = new Graph();

  _forEach(layerGraphs, function (lg) {
    const root = lg.graph().root;
    const sorted = sortSubgraph(lg, root, cg, biasRight);

    _forEach(sorted.vs, function (v, i) {
      lg.node(v).order = i;
    });

    addSubgraphConstraints(lg, cg, sorted.vs);
  });
}

function assignOrder (g, layering) {
  _forEach(layering, function (layer) {
    _forEach(layer, function (v, i) {
      g.node(v).order = i;
    });
  });
}

export { order as default };
//# sourceMappingURL=index.js.map
