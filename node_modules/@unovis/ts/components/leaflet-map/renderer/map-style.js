import mapLibreBaseSettings from './mapboxgl/mapboxgl-settings.json.js';
import mapLibreDarkTheme from './mapboxgl/mapboxgl-dark-theme.json.js';
import mapLibreLightTheme from './mapboxgl/mapboxgl-light-theme.json.js';

const MapLibreArcticDark = Object.assign(Object.assign({}, mapLibreBaseSettings), { layers: [
        ...mapLibreDarkTheme.layers,
        ...mapLibreBaseSettings.layers,
    ] });
const MapLibreArcticLight = Object.assign(Object.assign({}, mapLibreBaseSettings), { layers: [
        ...mapLibreLightTheme.layers,
        ...mapLibreBaseSettings.layers,
    ] });

export { MapLibreArcticDark, MapLibreArcticLight };
//# sourceMappingURL=map-style.js.map
