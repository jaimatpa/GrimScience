import _sortBy from 'lodash-es/sortBy'
import _forEach from 'lodash-es/forEach'
import _has from 'lodash-es/has'
import _range from 'lodash-es/range'
import _map from 'lodash-es/map'
import _max from 'lodash-es/max'
import _filter from 'lodash-es/filter'

/*
 * Assigns an initial order value for each node by performing a DFS search
 * starting from nodes in the first rank. Nodes are assigned an order in their
 * rank as they are first visited.
 *
 * This approach comes from Gansner, et al., "A Technique for Drawing Directed
 * Graphs."
 *
 * Returns a layering matrix with an array per layer and each layer sorted by
 * the order of its nodes.
 */
function initOrder (g) {
  const visited = {}

  const simpleNodes = _filter(g.nodes(), function (v) {
    return !g.children(v).length
  })

  const maxRank = _max(_map(simpleNodes, function (v) {
    return g.node(v).rank
  }))

  const layers = _map(_range(maxRank + 1), function () {
    return []
  })

  function dfs (v) {
    if (_has(visited, v)) return
    visited[v] = true
    const node = g.node(v)
    layers[node.rank].push(v)

    _forEach(g.successors(v), dfs)
  }

  const orderedVs = _sortBy(simpleNodes, function (v) {
    return g.node(v).rank
  })

  _forEach(orderedVs, dfs)

  return layers
}

export default initOrder
