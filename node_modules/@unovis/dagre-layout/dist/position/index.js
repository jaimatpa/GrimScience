import _map from 'lodash-es/map';
import _max from 'lodash-es/max';
import _forEach from 'lodash-es/forEach';
import util from '../util.js';
import { positionX } from './bk.js';

function position (g) {
  g = util.asNonCompoundGraph(g);
  positionY(g);

  _forEach(positionX(g), function (x, v) {
    g.node(v).x = x;
  });
}

function positionY (g) {
  const layering = util.buildLayerMatrix(g);
  const rankSep = g.graph().ranksep;
  let prevY = 0;

  _forEach(layering, function (layer) {
    const maxHeight = _max(_map(layer, function (v) {
      return g.node(v).height
    }));

    _forEach(layer, function (v) {
      g.node(v).y = prevY + maxHeight / 2;
    });

    prevY += maxHeight + rankSep;
  });
}

export { position as default };
//# sourceMappingURL=index.js.map
