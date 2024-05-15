import { select } from 'd3-selection';
import { ComponentCore } from '../../core/component/index.js';
import { ComponentType } from '../../types/component.js';
import { ResizeObserver } from '../../utils/resize-observer.js';
import { throttle, getNumber } from '../../utils/data.js';
import { getDataLatLngBounds } from '../../utils/map.js';
import { getColor } from '../../utils/color.js';
import { LeafletMap } from '../leaflet-map/index.js';
import { LeafletFlowMapDefaultConfig } from './config.js';

class LeafletFlowMap extends ComponentCore {
    constructor(container, config, data) {
        var _a;
        super(ComponentType.HTML);
        this._defaultConfig = LeafletFlowMapDefaultConfig;
        this.config = this._defaultConfig;
        this.type = ComponentType.HTML;
        this.flows = [];
        this.points = [];
        this.onCanvasMouseMoveBound = throttle(this.onCanvasMouseMove.bind(this), 60);
        this.onCanvasClickBound = this.onCanvasClick.bind(this);
        this.panningOffset = { x: 0, y: 0 };
        this.particles = [];
        this.leafletMap = new LeafletMap(container, config, (_a = data === null || data === void 0 ? void 0 : data.points) !== null && _a !== void 0 ? _a : []);
        const rendererImportPromise = import('./renderer.js');
        Promise.all([rendererImportPromise, this.leafletMap.getLeafletInstancePromise()])
            .then((imports) => {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const [{ PointRenderer }, leaflet] = imports;
            this.leafletMapInstance = leaflet;
            const canvasContainer = this.leafletMapInstance.getPanes().overlayPane;
            // Initialize renderer
            const canvas = select(canvasContainer).insert('canvas', ':first-child');
            this.canvasElement = canvas.node();
            this.renderer = new PointRenderer(canvasContainer, container.offsetWidth, container.offsetHeight, this.canvasElement);
            this.canvasElement.addEventListener('mousemove', this.onCanvasMouseMoveBound);
            this.canvasElement.addEventListener('click', this.onCanvasClickBound);
            this.leafletMap._onMapMoveEndInternal = this.onMapMove.bind(this);
            // Update renderer size on container resize
            this.resizeObserver = new ResizeObserver(() => {
                this.renderer.setSize(container.offsetWidth, container.offsetHeight);
            });
            this.resizeObserver.observe(container);
            if (config)
                this.setConfig(config);
            if (data)
                this.setData(data);
            this.animate();
        });
    }
    setConfig(config) {
        super.setConfig(config);
        this.leafletMap.setConfig(Object.assign(Object.assign({}, config), { clusteringDistance: 0 }));
    }
    setData(data) {
        super.setData(data);
        this.flows = data.flows;
        this.points = data.points;
        this.initParticles();
        this.leafletMap.setData(this.points);
        this.render();
    }
    render() {
        super.render();
    }
    initParticles() {
        var _a;
        this.clearParticles();
        for (const flow of this.flows) {
            const source = {
                lat: getNumber(flow, this.config.sourceLatitude),
                lon: getNumber(flow, this.config.sourceLongitude),
            };
            const target = {
                lat: getNumber(flow, this.config.targetLatitude),
                lon: getNumber(flow, this.config.targetLongitude),
            };
            // Add source particle, showing the origin of the flow
            const sourcePointRadius = getNumber(flow, this.config.sourcePointRadius);
            const sourcePointColor = getColor(flow, this.config.sourcePointColor);
            this.addParticle(source, source, source, 0, sourcePointRadius, sourcePointColor);
            // Add flow particles
            const dist = Math.sqrt(Math.pow((target.lat - source.lat), 2) + Math.pow((target.lon - source.lon), 2));
            const numParticles = Math.round(dist * getNumber(flow, this.config.flowParticleDensity));
            const velocity = getNumber(flow, this.config.flowParticleSpeed);
            const r = getNumber(flow, this.config.flowParticleRadius);
            const color = getColor(flow, this.config.flowParticleColor);
            for (let i = 0; i < numParticles; i += 1) {
                const location = {
                    lat: source.lat + (target.lat - source.lat) * i / numParticles,
                    lon: source.lon + (target.lon - source.lon) * i / numParticles,
                };
                this.addParticle(source, target, location, velocity, r, color);
            }
        }
        (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.update(this.particles);
    }
    addParticle(source, target, location = source, velocity = 0.05, r = 0.75, color) {
        const x = 0;
        const y = 0;
        this.particles.push({ x, y, source, target, location, velocity, r, color });
    }
    clearParticles() {
        this.particles = [];
    }
    animate() {
        const map = this.leafletMapInstance;
        requestAnimationFrame(() => {
            const zoomLevel = map === null || map === void 0 ? void 0 : map.getZoom();
            for (const p of this.particles) {
                const fullDist = Math.sqrt(Math.pow((p.target.lat - p.source.lat), 2) + Math.pow((p.target.lon - p.source.lon), 2));
                const remainedDist = Math.sqrt(Math.pow((p.target.lat - p.location.lat), 2) + Math.pow((p.target.lon - p.location.lon), 2));
                const angle = Math.atan2(p.target.lat - p.source.lat, p.target.lon - p.source.lon);
                p.location.lat += p.velocity * Math.sin(angle);
                p.location.lon += p.velocity * Math.cos(angle);
                if ((((p.target.lat > p.source.lat) && (p.location.lat > p.target.lat)) || ((p.target.lon > p.source.lon) && (p.location.lon > p.target.lon))) ||
                    (((p.target.lat < p.source.lat) && (p.location.lat < p.target.lat)) || ((p.target.lon < p.source.lon) && (p.location.lon < p.target.lon)))) {
                    p.location.lat = p.source.lat;
                    p.location.lon = p.source.lon;
                }
                const pos = map === null || map === void 0 ? void 0 : map.latLngToLayerPoint([p.location.lat, p.location.lon]);
                const orthogonalArcShift = -(Math.pow(zoomLevel, 2) * fullDist / 8) * Math.cos(Math.PI / 2 * (fullDist / 2 - remainedDist) / (fullDist / 2)) || 0;
                p.x = (pos === null || pos === void 0 ? void 0 : pos.x) - this.panningOffset.x;
                p.y = (pos === null || pos === void 0 ? void 0 : pos.y) + orthogonalArcShift - this.panningOffset.y;
            }
            this.renderer.updatePointsPosition(this.particles);
            this.renderer.draw();
            this.animate();
        });
    }
    getPointByScreenPos(x, y) {
        const map = this.leafletMapInstance;
        for (const flow of this.flows) {
            const lat = getNumber(flow, this.config.sourceLatitude);
            const lon = getNumber(flow, this.config.sourceLongitude);
            const r = getNumber(flow, this.config.sourcePointRadius);
            const pos = map === null || map === void 0 ? void 0 : map.latLngToLayerPoint([lat, lon]);
            const posX = pos.x - this.panningOffset.x;
            const posY = pos.y - this.panningOffset.y;
            if ((Math.abs(x - posX) < r) && (Math.abs(y - posY) < r)) {
                return [flow, posX, posY];
            }
        }
        return [];
    }
    onCanvasMouseMove(event) {
        var _a, _b;
        const { config } = this;
        this.canvasElement.style.removeProperty('cursor');
        const [hoveredPoint, x, y] = this.getPointByScreenPos(event.offsetX, event.offsetY);
        if (hoveredPoint)
            this.canvasElement.style.cursor = 'default';
        if (this.hoveredSourcePoint !== hoveredPoint) {
            if (hoveredPoint)
                (_a = config.onSourcePointMouseEnter) === null || _a === void 0 ? void 0 : _a.call(config, hoveredPoint, x, y, event);
            if (this.hoveredSourcePoint)
                (_b = config.onSourcePointMouseLeave) === null || _b === void 0 ? void 0 : _b.call(config, this.hoveredSourcePoint, event);
            this.hoveredSourcePoint = hoveredPoint;
        }
    }
    onCanvasClick(event) {
        var _a;
        const { config } = this;
        const [clickedPoint, x, y] = this.getPointByScreenPos(event.offsetX, event.offsetY);
        if (clickedPoint)
            (_a = config.onSourcePointClick) === null || _a === void 0 ? void 0 : _a.call(config, clickedPoint, x, y, event);
    }
    onMapMove(leaflet) {
        const shift = leaflet.containerPointToLayerPoint([0, 0]);
        this.panningOffset.x = shift.x;
        this.panningOffset.y = shift.y;
        this.canvasElement.style.transform = `translate(${shift.x}px, ${shift.y}px)`;
    }
    destroy() {
        var _a, _b, _c, _d;
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        (_b = this.renderer) === null || _b === void 0 ? void 0 : _b.destroy();
        (_c = this.canvasElement) === null || _c === void 0 ? void 0 : _c.removeEventListener('mousemove', this.onCanvasMouseMoveBound);
        (_d = this.canvasElement) === null || _d === void 0 ? void 0 : _d.removeEventListener('click', this.onCanvasClickBound);
        super.destroy();
    }
    // Leaflet Map useful methods
    selectPointById(id, centerPoint = false) { this.leafletMap.selectPointById(id, centerPoint); }
    getSelectedPointId() { return this.leafletMap.getSelectedPointId(); }
    unselectPoint() { this.leafletMap.unselectPoint(); }
    zoomToPointById(id, selectNode = false, customZoomLevel) { this.leafletMap.zoomToPointById(id, selectNode, customZoomLevel); }
    zoomIn(increment = 1) { this.leafletMap.zoomIn(increment); }
    zoomOut(increment = 1) { this.leafletMap.zoomOut(increment); }
    setZoom(zoomLevel) { this.leafletMap.setZoom(zoomLevel); }
    fitView() {
        const points = [];
        for (const point of this.points) {
            points.push({
                lat: getNumber(point, this.config.pointLatitude),
                lon: getNumber(point, this.config.pointLongitude),
            });
        }
        for (const flow of this.flows) {
            const source = {
                lat: getNumber(flow, this.config.sourceLatitude),
                lon: getNumber(flow, this.config.sourceLongitude),
            };
            const target = {
                lat: getNumber(flow, this.config.targetLatitude),
                lon: getNumber(flow, this.config.targetLongitude),
            };
            points.push(source);
            points.push(target);
        }
        const boundsArray = getDataLatLngBounds(points, d => d.lat, d => d.lon, 0);
        const bounds = {
            northEast: { lat: boundsArray[0][0], lng: boundsArray[1][1] },
            southWest: { lat: boundsArray[1][0], lng: boundsArray[0][1] },
        };
        this.leafletMap.fitToBounds(bounds);
    }
}
LeafletFlowMap.selectors = LeafletMap.selectors;

export { LeafletFlowMap };
//# sourceMappingURL=index.js.map
