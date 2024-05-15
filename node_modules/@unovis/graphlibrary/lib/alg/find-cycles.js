import _filter from 'lodash-es/filter'
import tarjan from './tarjan'
export default findCycles

function findCycles (g) {
  return _filter(tarjan(g), function (cmpt) {
    return cmpt.length > 1 || (cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]))
  })
}
