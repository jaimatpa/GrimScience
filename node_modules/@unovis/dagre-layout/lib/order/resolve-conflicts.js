import _pick from 'lodash-es/pick'
import _map from 'lodash-es/map'
import _filter from 'lodash-es/filter'
import _isUndefined from 'lodash-es/isUndefined'
import _forEach from 'lodash-es/forEach'

/*
 * Given a list of entries of the form {v, barycenter, weight} and a
 * constraint graph this function will resolve any conflicts between the
 * constraint graph and the barycenters for the entries. If the barycenters for
 * an entry would violate a constraint in the constraint graph then we coalesce
 * the nodes in the conflict into a new node that respects the contraint and
 * aggregates barycenter and weight information.
 *
 * This implementation is based on the description in Forster, "A Fast and
 * Simple Hueristic for Constrained Two-Level Crossing Reduction," thought it
 * differs in some specific details.
 *
 * Pre-conditions:
 *
 *    1. Each entry has the form {v, barycenter, weight}, or if the node has
 *       no barycenter, then {v}.
 *
 * Returns:
 *
 *    A new list of entries of the form {vs, i, barycenter, weight}. The list
 *    `vs` may either be a singleton or it may be an aggregation of nodes
 *    ordered such that they do not violate constraints from the constraint
 *    graph. The property `i` is the lowest original index of any of the
 *    elements in `vs`.
 */
function resolveConflicts (entries, cg) {
  const mappedEntries = {}

  _forEach(entries, function (entry, i) {
    const tmp = mappedEntries[entry.v] = {
      indegree: 0,
      'in': [],
      out: [],
      vs: [entry.v],
      i: i
    }

    if (!_isUndefined(entry.barycenter)) {
      tmp.barycenter = entry.barycenter
      tmp.weight = entry.weight
    }
  })

  _forEach(cg.edges(), function (e) {
    const entryV = mappedEntries[e.v]
    const entryW = mappedEntries[e.w]

    if (!_isUndefined(entryV) && !_isUndefined(entryW)) {
      entryW.indegree++
      entryV.out.push(mappedEntries[e.w])
    }
  })

  const sourceSet = _filter(mappedEntries, function (entry) {
    return !entry.indegree
  })

  return doResolveConflicts(sourceSet)
}

function doResolveConflicts (sourceSet) {
  const entries = []

  function handleIn (vEntry) {
    return function (uEntry) {
      if (uEntry.merged) {
        return
      }

      if (_isUndefined(uEntry.barycenter) || _isUndefined(vEntry.barycenter) || uEntry.barycenter >= vEntry.barycenter) {
        mergeEntries(vEntry, uEntry)
      }
    }
  }

  function handleOut (vEntry) {
    return function (wEntry) {
      wEntry['in'].push(vEntry)

      if (--wEntry.indegree === 0) {
        sourceSet.push(wEntry)
      }
    }
  }

  while (sourceSet.length) {
    const entry = sourceSet.pop()
    entries.push(entry)

    _forEach(entry['in'].reverse(), handleIn(entry))

    _forEach(entry.out, handleOut(entry))
  }

  const entriesFiltered = _filter(entries, function (entry) {
    return !entry.merged
  })

  return _map(entriesFiltered, function (entry) {
    return _pick(entry, ['vs', 'i', 'barycenter', 'weight'])
  })
}

function mergeEntries (target, source) {
  let sum = 0
  let weight = 0

  if (target.weight) {
    sum += target.barycenter * target.weight
    weight += target.weight
  }

  if (source.weight) {
    sum += source.barycenter * source.weight
    weight += source.weight
  }

  target.vs = source.vs.concat(target.vs)
  target.barycenter = sum / weight
  target.weight = weight
  target.i = Math.min(source.i, target.i)
  source.merged = true
}

export default resolveConflicts
