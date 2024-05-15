import _size from 'lodash-es/size';
import _each from 'lodash-es/each';
import _has from 'lodash-es/has';

function topsort (g) {
  const visited = {};
  const stack = {};
  const results = [];

  function visit (node) {
    if (_has(stack, node)) {
      throw new CycleException()
    }

    if (!_has(visited, node)) {
      stack[node] = true;
      visited[node] = true;

      _each(g.predecessors(node), visit);

      delete stack[node];
      results.push(node);
    }
  }

  _each(g.sinks(), visit);

  if (_size(visited) !== g.nodeCount()) {
    throw new CycleException()
  }

  return results
}

function CycleException () {}

CycleException.prototype = new Error(); // must be an instance of Error to pass testing

topsort.CycleException = CycleException;

export { topsort as default };
//# sourceMappingURL=topsort.js.map
