import _each from 'lodash-es/each'
import _map from 'lodash-es/map'
import _clone from 'lodash-es/clone'
import _isUndefined from 'lodash-es/isUndefined'
import Graph from './graph'
export function write (g) {
  var json = {
    options: {
      directed: g.isDirected(),
      multigraph: g.isMultigraph(),
      compound: g.isCompound()
    },
    nodes: writeNodes(g),
    edges: writeEdges(g)
  }

  if (!_isUndefined(g.graph())) {
    json.value = _clone(g.graph())
  }

  return json
}

function writeNodes (g) {
  return _map(g.nodes(), function (v) {
    const nodeValue = g.node(v)
    const parent = g.parent(v)
    const node = {
      v: v
    }

    if (!_isUndefined(nodeValue)) {
      node.value = nodeValue
    }

    if (!_isUndefined(parent)) {
      node.parent = parent
    }

    return node
  })
}

function writeEdges (g) {
  return _map(g.edges(), function (e) {
    const edgeValue = g.edge(e)
    const edge = {
      v: e.v,
      w: e.w
    }

    if (!_isUndefined(e.name)) {
      edge.name = e.name
    }

    if (!_isUndefined(edgeValue)) {
      edge.value = edgeValue
    }

    return edge
  })
}

export function read (json) {
  var g = new Graph(json.options).setGraph(json.value)

  _each(json.nodes, function (entry) {
    g.setNode(entry.v, entry.value)

    if (entry.parent) {
      g.setParent(entry.v, entry.parent)
    }
  })

  _each(json.edges, function (entry) {
    g.setEdge({
      v: entry.v,
      w: entry.w,
      name: entry.name
    }, entry.value)
  })

  return g
}
