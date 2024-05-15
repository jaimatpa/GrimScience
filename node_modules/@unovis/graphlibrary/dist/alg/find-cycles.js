import _filter from 'lodash-es/filter';
import tarjan from './tarjan.js';

function findCycles (g) {
  return _filter(tarjan(g), function (cmpt) {
    return cmpt.length > 1 || (cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]))
  })
}

export { findCycles as default };
//# sourceMappingURL=find-cycles.js.map
