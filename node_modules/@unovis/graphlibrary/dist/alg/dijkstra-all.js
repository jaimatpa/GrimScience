import _transform from 'lodash-es/transform';
import dijkstra from './dijkstra.js';

function dijkstraAll (g, weightFunc, edgeFunc) {
  return _transform(g.nodes(), function (acc, v) {
    acc[v] = dijkstra(g, v, weightFunc, edgeFunc);
  }, {})
}

export { dijkstraAll as default };
//# sourceMappingURL=dijkstra-all.js.map
