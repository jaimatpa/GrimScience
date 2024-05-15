import _reduce from 'lodash-es/reduce'
import _values from 'lodash-es/values'
import _union from 'lodash-es/union'
import _isUndefined from 'lodash-es/isUndefined'
import _each from 'lodash-es/each'
import _isEmpty from 'lodash-es/isEmpty'
import _filter from 'lodash-es/filter'
import _keys from 'lodash-es/keys'
import _isFunction from 'lodash-es/isFunction'
import _constant from 'lodash-es/constant'
import _has from 'lodash-es/has'
export default Graph
const DEFAULT_EDGE_NAME = '\x00'
const GRAPH_NODE = '\x00'
const EDGE_KEY_DELIM = '\x01' // Implementation notes:
//
//  * Node id query functions should return string ids for the nodes
//  * Edge id query functions should return an "edgeObj", edge object, that is
//    composed of enough information to uniquely identify an edge: {v, w, name}.
//  * Internally we use an "edgeId", a stringified form of the edgeObj, to
//    reference edges. This is because we need a performant way to look these
//    edges up and, object properties, which have string keys, are the closest
//    we're going to get to a performant hashtable in JavaScript.

function Graph (opts) {
  this._isDirected = _has(opts, 'directed') ? opts.directed : true
  this._isMultigraph = _has(opts, 'multigraph') ? opts.multigraph : false
  this._isCompound = _has(opts, 'compound') ? opts.compound : false // Label for the graph itself

  this._label = undefined // Defaults to be set when creating a new node

  this._defaultNodeLabelFn = _constant(undefined) // Defaults to be set when creating a new edge

  this._defaultEdgeLabelFn = _constant(undefined) // v -> label

  this._nodes = {}

  if (this._isCompound) {
    // v -> parent
    this._parent = {} // v -> children

    this._children = {}
    this._children[GRAPH_NODE] = {}
  } // v -> edgeObj

  this._in = {} // u -> v -> Number

  this._preds = {} // v -> edgeObj

  this._out = {} // v -> w -> Number

  this._sucs = {} // e -> edgeObj

  this._edgeObjs = {} // e -> label

  this._edgeLabels = {}
}
/* Number of nodes in the graph. Should only be changed by the implementation. */

Graph.prototype._nodeCount = 0
/* Number of edges in the graph. Should only be changed by the implementation. */

Graph.prototype._edgeCount = 0
/* === Graph functions ========= */

Graph.prototype.isDirected = function () {
  return this._isDirected
}

Graph.prototype.isMultigraph = function () {
  return this._isMultigraph
}

Graph.prototype.isCompound = function () {
  return this._isCompound
}

Graph.prototype.setGraph = function (label) {
  this._label = label
  return this
}

Graph.prototype.graph = function () {
  return this._label
}
/* === Node functions ========== */

Graph.prototype.setDefaultNodeLabel = function (newDefault) {
  if (!_isFunction(newDefault)) {
    newDefault = _constant(newDefault)
  }

  this._defaultNodeLabelFn = newDefault
  return this
}

Graph.prototype.nodeCount = function () {
  return this._nodeCount
}

Graph.prototype.nodes = function () {
  return _keys(this._nodes)
}

Graph.prototype.sources = function () {
  var self = this
  return _filter(this.nodes(), function (v) {
    return _isEmpty(self._in[v])
  })
}

Graph.prototype.sinks = function () {
  var self = this
  return _filter(this.nodes(), function (v) {
    return _isEmpty(self._out[v])
  })
}

Graph.prototype.setNodes = function (vs, value) {
  var args = arguments
  var self = this

  _each(vs, function (v) {
    if (args.length > 1) {
      self.setNode(v, value)
    } else {
      self.setNode(v)
    }
  })

  return this
}

Graph.prototype.setNode = function (v, value) {
  if (_has(this._nodes, v)) {
    if (arguments.length > 1) {
      this._nodes[v] = value
    }

    return this
  }

  this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v)

  if (this._isCompound) {
    this._parent[v] = GRAPH_NODE
    this._children[v] = {}
    this._children[GRAPH_NODE][v] = true
  }

  this._in[v] = {}
  this._preds[v] = {}
  this._out[v] = {}
  this._sucs[v] = {}
  ++this._nodeCount
  return this
}

Graph.prototype.node = function (v) {
  return this._nodes[v]
}

Graph.prototype.hasNode = function (v) {
  return _has(this._nodes, v)
}

Graph.prototype.removeNode = function (v) {
  var self = this

  if (_has(this._nodes, v)) {
    var removeEdge = function (e) {
      self.removeEdge(self._edgeObjs[e])
    }

    delete this._nodes[v]

    if (this._isCompound) {
      this._removeFromParentsChildList(v)

      delete this._parent[v]

      _each(this.children(v), function (child) {
        self.setParent(child)
      })

      delete this._children[v]
    }

    _each(_keys(this._in[v]), removeEdge)

    delete this._in[v]
    delete this._preds[v]

    _each(_keys(this._out[v]), removeEdge)

    delete this._out[v]
    delete this._sucs[v]
    --this._nodeCount
  }

  return this
}

Graph.prototype.setParent = function (v, parent) {
  if (!this._isCompound) {
    throw new Error('Cannot set parent in a non-compound graph')
  }

  if (_isUndefined(parent)) {
    parent = GRAPH_NODE
  } else {
    // Coerce parent to string
    parent += ''

    for (var ancestor = parent; !_isUndefined(ancestor); ancestor = this.parent(ancestor)) {
      if (ancestor === v) {
        throw new Error('Setting ' + parent + ' as parent of ' + v + ' would create a cycle')
      }
    }

    this.setNode(parent)
  }

  this.setNode(v)

  this._removeFromParentsChildList(v)

  this._parent[v] = parent
  this._children[parent][v] = true
  return this
}

Graph.prototype._removeFromParentsChildList = function (v) {
  delete this._children[this._parent[v]][v]
}

Graph.prototype.parent = function (v) {
  if (this._isCompound) {
    var parent = this._parent[v]

    if (parent !== GRAPH_NODE) {
      return parent
    }
  }
}

Graph.prototype.children = function (v) {
  if (_isUndefined(v)) {
    v = GRAPH_NODE
  }

  if (this._isCompound) {
    var children = this._children[v]

    if (children) {
      return _keys(children)
    }
  } else if (v === GRAPH_NODE) {
    return this.nodes()
  } else if (this.hasNode(v)) {
    return []
  }
}

Graph.prototype.predecessors = function (v) {
  var predsV = this._preds[v]

  if (predsV) {
    return _keys(predsV)
  }
}

Graph.prototype.successors = function (v) {
  var sucsV = this._sucs[v]

  if (sucsV) {
    return _keys(sucsV)
  }
}

Graph.prototype.neighbors = function (v) {
  var preds = this.predecessors(v)

  if (preds) {
    return _union(preds, this.successors(v))
  }
}

Graph.prototype.isLeaf = function (v) {
  var neighbors

  if (this.isDirected()) {
    neighbors = this.successors(v)
  } else {
    neighbors = this.neighbors(v)
  }

  return neighbors.length === 0
}

Graph.prototype.filterNodes = function (filter) {
  var copy = new this.constructor({
    directed: this._isDirected,
    multigraph: this._isMultigraph,
    compound: this._isCompound
  })
  copy.setGraph(this.graph())
  var self = this

  _each(this._nodes, function (value, v) {
    if (filter(v)) {
      copy.setNode(v, value)
    }
  })

  _each(this._edgeObjs, function (e) {
    if (copy.hasNode(e.v) && copy.hasNode(e.w)) {
      copy.setEdge(e, self.edge(e))
    }
  })

  var parents = {}

  function findParent (v) {
    var parent = self.parent(v)

    if (parent === undefined || copy.hasNode(parent)) {
      parents[v] = parent
      return parent
    } else if (parent in parents) {
      return parents[parent]
    } else {
      return findParent(parent)
    }
  }

  if (this._isCompound) {
    _each(copy.nodes(), function (v) {
      copy.setParent(v, findParent(v))
    })
  }

  return copy
}
/* === Edge functions ========== */

Graph.prototype.setDefaultEdgeLabel = function (newDefault) {
  if (!_isFunction(newDefault)) {
    newDefault = _constant(newDefault)
  }

  this._defaultEdgeLabelFn = newDefault
  return this
}

Graph.prototype.edgeCount = function () {
  return this._edgeCount
}

Graph.prototype.edges = function () {
  return _values(this._edgeObjs)
}

Graph.prototype.setPath = function (vs, value) {
  const self = this
  const args = arguments

  _reduce(vs, function (v, w) {
    if (args.length > 1) {
      self.setEdge(v, w, value)
    } else {
      self.setEdge(v, w)
    }

    return w
  })

  return this
}
/*
 * setEdge(v, w, [value, [name]])
 * setEdge({ v, w, [name] }, [value])
 */

Graph.prototype.setEdge = function () {
  let v, w, name, value
  let valueSpecified = false
  const arg0 = arguments[0]

  if (typeof arg0 === 'object' && arg0 !== null && 'v' in arg0) {
    v = arg0.v
    w = arg0.w
    name = arg0.name

    if (arguments.length === 2) {
      value = arguments[1]
      valueSpecified = true
    }
  } else {
    v = arg0
    w = arguments[1]
    name = arguments[3]

    if (arguments.length > 2) {
      value = arguments[2]
      valueSpecified = true
    }
  }

  v = '' + v
  w = '' + w

  if (!_isUndefined(name)) {
    name = '' + name
  }

  var e = edgeArgsToId(this._isDirected, v, w, name)

  if (_has(this._edgeLabels, e)) {
    if (valueSpecified) {
      this._edgeLabels[e] = value
    }

    return this
  }

  if (!_isUndefined(name) && !this._isMultigraph) {
    throw new Error('Cannot set a named edge when isMultigraph = false')
  } // It didn't exist, so we need to create it.
  // First ensure the nodes exist.

  this.setNode(v)
  this.setNode(w)
  this._edgeLabels[e] = valueSpecified ? value : this._defaultEdgeLabelFn(v, w, name)
  var edgeObj = edgeArgsToObj(this._isDirected, v, w, name) // Ensure we add undirected edges in a consistent way.

  v = edgeObj.v
  w = edgeObj.w
  Object.freeze(edgeObj)
  this._edgeObjs[e] = edgeObj
  incrementOrInitEntry(this._preds[w], v)
  incrementOrInitEntry(this._sucs[v], w)
  this._in[w][e] = edgeObj
  this._out[v][e] = edgeObj
  this._edgeCount++
  return this
}

Graph.prototype.edge = function (v, w, name) {
  var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name)
  return this._edgeLabels[e]
}

Graph.prototype.hasEdge = function (v, w, name) {
  var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name)
  return _has(this._edgeLabels, e)
}

Graph.prototype.removeEdge = function (v, w, name) {
  const e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name)
  const edge = this._edgeObjs[e]

  if (edge) {
    v = edge.v
    w = edge.w
    delete this._edgeLabels[e]
    delete this._edgeObjs[e]
    decrementOrRemoveEntry(this._preds[w], v)
    decrementOrRemoveEntry(this._sucs[v], w)
    delete this._in[w][e]
    delete this._out[v][e]
    this._edgeCount--
  }

  return this
}

Graph.prototype.inEdges = function (v, u) {
  var inV = this._in[v]

  if (inV) {
    var edges = _values(inV)

    if (!u) {
      return edges
    }

    return _filter(edges, function (edge) {
      return edge.v === u
    })
  }
}

Graph.prototype.outEdges = function (v, w) {
  var outV = this._out[v]

  if (outV) {
    var edges = _values(outV)

    if (!w) {
      return edges
    }

    return _filter(edges, function (edge) {
      return edge.w === w
    })
  }
}

Graph.prototype.nodeEdges = function (v, w) {
  var inEdges = this.inEdges(v, w)

  if (inEdges) {
    return inEdges.concat(this.outEdges(v, w))
  }
}

function incrementOrInitEntry (map, k) {
  if (map[k]) {
    map[k]++
  } else {
    map[k] = 1
  }
}

function decrementOrRemoveEntry (map, k) {
  if (!--map[k]) {
    delete map[k]
  }
}

function edgeArgsToId (isDirected, v_, w_, name) {
  var v = '' + v_
  var w = '' + w_

  if (!isDirected && v > w) {
    var tmp = v
    v = w
    w = tmp
  }

  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM + (_isUndefined(name) ? DEFAULT_EDGE_NAME : name)
}

function edgeArgsToObj (isDirected, v_, w_, name) {
  var v = '' + v_
  var w = '' + w_

  if (!isDirected && v > w) {
    var tmp = v
    v = w
    w = tmp
  }

  var edgeObj = {
    v: v,
    w: w
  }

  if (name) {
    edgeObj.name = name
  }

  return edgeObj
}

function edgeObjToId (isDirected, edgeObj) {
  return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name)
}
