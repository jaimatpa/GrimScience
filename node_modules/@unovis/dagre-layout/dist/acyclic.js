import _has from 'lodash-es/has';
import _uniqueId from 'lodash-es/uniqueId';
import _forEach from 'lodash-es/forEach';
import greedyFAS from './greedy-fas.js';

function run (g) {
  const fas = g.graph().acyclicer === 'greedy' ? greedyFAS(g, weightFn(g)) : dfsFAS(g);

  _forEach(fas, function (e) {
    const label = g.edge(e);
    g.removeEdge(e);
    label.forwardName = e.name;
    label.reversed = true;
    g.setEdge(e.w, e.v, label, _uniqueId('rev'));
  });

  function weightFn (g) {
    return function (e) {
      return g.edge(e).weight
    }
  }
}

function dfsFAS (g) {
  const fas = [];
  const stack = {};
  const visited = {};

  function dfs (v) {
    if (_has(visited, v)) {
      return
    }

    visited[v] = true;
    stack[v] = true;

    _forEach(g.outEdges(v), function (e) {
      if (_has(stack, e.w)) {
        fas.push(e);
      } else {
        dfs(e.w);
      }
    });

    delete stack[v];
  }

  _forEach(g.nodes(), dfs);

  return fas
}

function undo (g) {
  _forEach(g.edges(), function (e) {
    const label = g.edge(e);

    if (label.reversed) {
      g.removeEdge(e);
      const forwardName = label.forwardName;
      delete label.reversed;
      delete label.forwardName;
      g.setEdge(e.w, e.v, label, forwardName);
    }
  });
}

var acyclic = {
  run,
  undo
};

export { acyclic as default };
//# sourceMappingURL=acyclic.js.map
