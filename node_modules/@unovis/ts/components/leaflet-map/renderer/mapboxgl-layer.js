import { injectGlobal } from '@emotion/css';
import { isObject } from '../../../utils/data.js';
import { MaplibreGLLayer } from './leaflet-maplibre-gl.js';
import mapLibreStyles from './maplibre-gl.css.js';

injectGlobal(mapLibreStyles);
function getMaplibreGLLayer(config, leaflet, maplibre) {
    const { accessToken, style } = config;
    if (isObject(style) && !style.glyphs) {
        console.warn('Unovis | Leaflet Map: Glyphs URL is required in order to show the map. Set `mapboxglGlyphs` URL in the style settings');
        return;
    }
    if (isObject(style) && !style.sources) {
        console.warn('Unovis | Leaflet Map: Sources settings are required in order to show map. Set the `sources` property in the style settings');
        return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const layer = MaplibreGLLayer(leaflet, maplibre, {
        style: style,
        accessToken: accessToken || 'not-needed',
    });
    return layer;
}

export { getMaplibreGLLayer };
//# sourceMappingURL=mapboxgl-layer.js.map
