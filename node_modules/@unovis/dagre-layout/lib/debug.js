import _reduce from 'lodash-es/reduce'
import _forEach from 'lodash-es/forEach'
import { Graph } from '@unovis/graphlibrary'
import util from './util'
/* istanbul ignore next */

function debugOrdering (g) {
  const layerMatrix = util.buildLayerMatrix(g)
  const h = new Graph({
    compound: true,
    multigraph: true
  }).setGraph({})

  _forEach(g.nodes(), function (v) {
    h.setNode(v, {
      label: v
    })
    h.setParent(v, 'layer' + g.node(v).rank)
  })

  _forEach(g.edges(), function (e) {
    h.setEdge(e.v, e.w, {}, e.name)
  })

  _forEach(layerMatrix, function (layer, i) {
    const layerV = 'layer' + i
    h.setNode(layerV, {
      rank: 'same'
    })

    _reduce(layer, function (u, v) {
      h.setEdge(u, v, {
        style: 'invis'
      })
      return v
    })
  })

  return h
}

export default {
  debugOrdering
}
