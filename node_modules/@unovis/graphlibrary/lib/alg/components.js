import _each from 'lodash-es/each'
import _has from 'lodash-es/has'
export default components

function components (g) {
  const visited = {}
  const cmpts = []
  let cmpt

  function dfs (v) {
    if (_has(visited, v)) return
    visited[v] = true
    cmpt.push(v)

    _each(g.successors(v), dfs)

    _each(g.predecessors(v), dfs)
  }

  _each(g.nodes(), function (v) {
    cmpt = []
    dfs(v)

    if (cmpt.length) {
      cmpts.push(cmpt)
    }
  })

  return cmpts
}
