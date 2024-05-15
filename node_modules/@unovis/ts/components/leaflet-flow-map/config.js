import { LeafletMapDefaultConfig } from '../leaflet-map/config.js';

/* eslint-disable dot-notation */
const LeafletFlowMapDefaultConfig = Object.assign(Object.assign({}, LeafletMapDefaultConfig), { sourceLongitude: (f) => f.sourceLongitude, sourceLatitude: (f) => f.sourceLatitude, targetLongitude: (f) => f.targetLongitude, targetLatitude: (f) => f.targetLatitude, sourcePointRadius: 3, sourcePointColor: '#88919f', flowParticleColor: '#949dad', flowParticleRadius: 1.1, flowParticleSpeed: 0.07, flowParticleDensity: 0.6, onSourcePointClick: undefined, onSourcePointMouseEnter: undefined, onSourcePointMouseLeave: undefined });

export { LeafletFlowMapDefaultConfig };
//# sourceMappingURL=config.js.map
