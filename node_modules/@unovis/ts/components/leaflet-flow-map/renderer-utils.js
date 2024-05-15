import { Color } from 'three/src/math/Color.js';

const DEFAULT_POINT_RADIUS = 1;
const DEFAULT_POINT_COLOR = 'rgba(255, 113, 111, 1.000)';
function getRadius(r, devicePixelRatio) {
    return (r !== null && r !== void 0 ? r : DEFAULT_POINT_RADIUS) * devicePixelRatio;
}
function getColor(color) {
    const c = new Color();
    c.set(color !== null && color !== void 0 ? color : DEFAULT_POINT_COLOR);
    return c;
}

export { DEFAULT_POINT_COLOR, DEFAULT_POINT_RADIUS, getColor, getRadius };
//# sourceMappingURL=renderer-utils.js.map
