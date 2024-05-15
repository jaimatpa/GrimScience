import worldMap from './maps/world-simple.json.js';
import worldMapSimplest from './maps/world-simplest.json.js';
import worldMap110mAlpha from './maps/world-110m-alpha.json.js';
import unitedStates from './maps/us-states.json.js';
import usCounties from './maps/us-counties.json.js';
import china from './maps/china-provinces.json.js';
import france from './maps/fr-regions.json.js';
import germany from './maps/germany-regions.json.js';
import india from './maps/ind-regions.json.js';
import uk from './maps/uk-regions.json.js';

const WorldMapTopoJSON = worldMap;
const WorldMap110mAlphaTopoJSON = worldMap110mAlpha;
const WorldMapSimplestTopoJSON = worldMapSimplest;
const USATopoJSON = unitedStates;
const USCountiesTopoJSON = usCounties;
const GermanyTopoJSON = germany;
const UKTopoJSON = uk;
const FranceTopoJSON = france;
const IndiaTopoJSON = india;
const ChinaTopoJSON = china;

export { ChinaTopoJSON, FranceTopoJSON, GermanyTopoJSON, IndiaTopoJSON, UKTopoJSON, USATopoJSON, USCountiesTopoJSON, WorldMap110mAlphaTopoJSON, WorldMapSimplestTopoJSON, WorldMapTopoJSON };
