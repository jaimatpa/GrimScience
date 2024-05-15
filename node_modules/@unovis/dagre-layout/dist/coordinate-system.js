import _has from 'lodash-es/has';
import _forEach from 'lodash-es/forEach';

function adjust (g) {
  const rankDir = g.graph().rankdir.toLowerCase();

  if (rankDir === 'lr' || rankDir === 'rl') {
    swapWidthHeight(g);
  }
}

function undo (g) {
  const rankDir = g.graph().rankdir.toLowerCase();

  if (rankDir === 'bt' || rankDir === 'rl') {
    reverseY(g);
  }

  if (rankDir === 'lr' || rankDir === 'rl') {
    swapXY(g);
    swapWidthHeight(g);
  }
}

function swapWidthHeight (g) {
  _forEach(g.nodes(), function (v) {
    swapWidthHeightOne(g.node(v));
  });

  _forEach(g.edges(), function (e) {
    swapWidthHeightOne(g.edge(e));
  });
}

function swapWidthHeightOne (attrs) {
  const w = attrs.width;
  attrs.width = attrs.height;
  attrs.height = w;
}

function reverseY (g) {
  _forEach(g.nodes(), function (v) {
    reverseYOne(g.node(v));
  });

  _forEach(g.edges(), function (e) {
    const edge = g.edge(e);

    _forEach(edge.points, reverseYOne);

    if (_has(edge, 'y')) {
      reverseYOne(edge);
    }
  });
}

function reverseYOne (attrs) {
  attrs.y = -attrs.y;
}

function swapXY (g) {
  _forEach(g.nodes(), function (v) {
    swapXYOne(g.node(v));
  });

  _forEach(g.edges(), function (e) {
    const edge = g.edge(e);

    _forEach(edge.points, swapXYOne);

    if (_has(edge, 'x')) {
      swapXYOne(edge);
    }
  });
}

function swapXYOne (attrs) {
  const x = attrs.x;
  attrs.x = attrs.y;
  attrs.y = x;
}

var coordinateSystem = {
  adjust,
  undo
};

export { coordinateSystem as default };
//# sourceMappingURL=coordinate-system.js.map
