import { select } from 'd3-selection';
import { polygon } from '../../../utils/path.js';
import { getString } from '../../../utils/data.js';
import { isStringSvg, sanitizeSvgString } from '../../../utils/svg.js';
import { GraphNodeShape } from '../types.js';
import { getNodeSize } from './node/helper.js';

function appendShape(selection, shapeAccessor, shapeSelector, customShapeSelector, index, insertSelector = ':last-child') {
    selection.each((d, i, elements) => {
        const element = select(elements[i]);
        const shape = getString(d, shapeAccessor, index);
        let shapeElement;
        const isCustomShape = isStringSvg(shape);
        if (isCustomShape) {
            shapeElement = element.insert('g', insertSelector)
                .html(sanitizeSvgString(shape));
        }
        else {
            switch (shape) {
                case GraphNodeShape.Square:
                    shapeElement = element.insert('rect', insertSelector)
                        .attr('rx', 5)
                        .attr('ry', 5);
                    break;
                case GraphNodeShape.Hexagon:
                case GraphNodeShape.Triangle:
                    shapeElement = element.insert('path', insertSelector);
                    break;
                case GraphNodeShape.Circle:
                default:
                    shapeElement = element.insert('circle', insertSelector);
            }
        }
        shapeElement.classed(customShapeSelector, isCustomShape);
        return shapeElement.attr('class', shapeSelector);
    });
}
function updateShape(selection, shape, size, index) {
    if (selection.size() === 0)
        return;
    const d = selection.datum();
    const nodeSize = getNodeSize(d, size, index);
    selection.filter('circle')
        .attr('r', nodeSize / 2);
    selection.filter('rect')
        .attr('width', nodeSize)
        .attr('height', nodeSize)
        .attr('x', -nodeSize / 2)
        .attr('y', -nodeSize / 2);
    selection.filter('path')
        .attr('d', () => {
        let n;
        switch (getString(d, shape, index)) {
            case GraphNodeShape.Square:
                n = 4;
                break;
            case GraphNodeShape.Triangle:
                n = 3;
                break;
            case GraphNodeShape.Hexagon:
            default:
                n = 6;
        }
        return polygon(nodeSize, n);
    });
    selection.filter('g')
        .filter(() => !isStringSvg(getString(d, shape, index)))
        .html(getString(d, shape, index));
    selection.filter('g')
        .each((d, i, elements) => {
        const el = select(elements[i]);
        const bBox = el.node().getBBox();
        el.attr('transform', `translate(${-bBox.width / 2},${-bBox.height / 2})`);
    });
}

export { appendShape, updateShape };
//# sourceMappingURL=shape.js.map
