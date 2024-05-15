import _last from 'lodash-es/last'
import _flatten from 'lodash-es/flatten'
import _forEach from 'lodash-es/forEach'
import _sortBy from 'lodash-es/sortBy'
import _has from 'lodash-es/has'
import util from '../util'

function sort (entries, biasRight) {
  const parts = util.partition(entries, function (entry) {
    return _has(entry, 'barycenter')
  })
  const sortable = parts.lhs

  const unsortable = _sortBy(parts.rhs, function (entry) {
    return -entry.i
  })

  const vs = []
  let sum = 0
  let weight = 0
  let vsIndex = 0
  sortable.sort(compareWithBias(!!biasRight))
  vsIndex = consumeUnsortable(vs, unsortable, vsIndex)

  _forEach(sortable, function (entry) {
    vsIndex += entry.vs.length
    vs.push(entry.vs)
    sum += entry.barycenter * entry.weight
    weight += entry.weight
    vsIndex = consumeUnsortable(vs, unsortable, vsIndex)
  })

  const result = {
    vs: _flatten(vs, true)
  }

  if (weight) {
    result.barycenter = sum / weight
    result.weight = weight
  }

  return result
}

function consumeUnsortable (vs, unsortable, index) {
  let last

  while (unsortable.length && (last = _last(unsortable)).i <= index) {
    unsortable.pop()
    vs.push(last.vs)
    index++
  }

  return index
}

function compareWithBias (bias) {
  return function (entryV, entryW) {
    if (entryV.barycenter < entryW.barycenter) {
      return -1
    } else if (entryV.barycenter > entryW.barycenter) {
      return 1
    }

    return !bias ? entryV.i - entryW.i : entryW.i - entryV.i
  }
}

export default sort
