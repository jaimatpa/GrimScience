import _isUndefined from 'lodash-es/isUndefined';
import _flatten from 'lodash-es/flatten';
import _has from 'lodash-es/has';
import _forEach from 'lodash-es/forEach';
import _filter from 'lodash-es/filter';
import barycenter from './barycenter.js';
import resolveConflicts from './resolve-conflicts.js';
import sort from './sort.js';

function sortSubgraph (g, v, cg, biasRight) {
  let movable = g.children(v);
  const node = g.node(v);
  const bl = node ? node.borderLeft : undefined;
  const br = node ? node.borderRight : undefined;
  const subgraphs = {};

  if (bl) {
    movable = _filter(movable, function (w) {
      return w !== bl && w !== br
    });
  }

  const barycenters = barycenter(g, movable);

  _forEach(barycenters, function (entry) {
    if (g.children(entry.v).length) {
      const subgraphResult = sortSubgraph(g, entry.v, cg, biasRight);
      subgraphs[entry.v] = subgraphResult;

      if (_has(subgraphResult, 'barycenter')) {
        mergeBarycenters(entry, subgraphResult);
      }
    }
  });

  const entries = resolveConflicts(barycenters, cg);
  expandSubgraphs(entries, subgraphs);
  const result = sort(entries, biasRight);

  if (bl) {
    result.vs = _flatten([bl, result.vs, br], true);

    if (g.predecessors(bl).length) {
      const blPred = g.node(g.predecessors(bl)[0]);
      const brPred = g.node(g.predecessors(br)[0]);

      if (!_has(result, 'barycenter')) {
        result.barycenter = 0;
        result.weight = 0;
      }

      result.barycenter = (result.barycenter * result.weight + blPred.order + brPred.order) / (result.weight + 2);
      result.weight += 2;
    }
  }

  return result
}

function expandSubgraphs (entries, subgraphs) {
  _forEach(entries, function (entry) {
    entry.vs = _flatten(entry.vs.map(function (v) {
      if (subgraphs[v]) {
        return subgraphs[v].vs
      }

      return v
    }), true);
  });
}

function mergeBarycenters (target, other) {
  if (!_isUndefined(target.barycenter)) {
    target.barycenter = (target.barycenter * target.weight + other.barycenter * other.weight) / (target.weight + other.weight);
    target.weight += other.weight;
  } else {
    target.barycenter = other.barycenter;
    target.weight = other.weight;
  }
}

export { sortSubgraph as default };
//# sourceMappingURL=sort-subgraph.js.map
