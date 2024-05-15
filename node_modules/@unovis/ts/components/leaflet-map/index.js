import { select } from 'd3-selection';
import { packSiblings } from 'd3-hierarchy';
import { ComponentCore } from '../../core/component/index.js';
import { MapDataModel } from '../../data-models/map.js';
import { ComponentType } from '../../types/component.js';
import { ResizeObserver } from '../../utils/resize-observer.js';
import { isString, getNumber, isNil, getString, clamp } from '../../utils/data.js';
import { constraintMapViewThrottled } from './renderer/mapboxgl-utils.js';
import { calculateClusterIndex, projectPoint, findPointAndClusterByPointId, getNodeRelativePosition, bBoxMerge, shouldClusterExpand, getNextZoomLevelOnClusterClick, getPointRadius, getClusterRadius, getClustersAndPoints, geoJsonPointToScreenPoint } from './modules/utils.js';
import { LeafletMapRenderer } from './types.js';
import { LeafletMapDefaultConfig } from './config.js';
import * as style from './style.js';
import { root, map, svgOverlay, backgroundRect, points, clusterBackground, pointSelectionRing, point, variables } from './style.js';
import { setupMap, initialMapCenter, initialMapZoom, updateTopoJson } from './modules/map.js';
import { removeNodes, createNodes, updateNodes, collideLabels } from './modules/node.js';
import { createNodeSelectionRing, updateNodeSelectionRing } from './modules/selectionRing.js';
import { createBackgroundNode, updateBackgroundNode } from './modules/clusterBackground.js';

class LeafletMap extends ComponentCore {
    constructor(container, config, data) {
        super(ComponentType.HTML);
        this._defaultConfig = LeafletMapDefaultConfig;
        this.config = this._defaultConfig;
        this.type = ComponentType.HTML;
        this.datamodel = new MapDataModel();
        this._expandedCluster = null;
        this._cancelBackgroundClick = false;
        this._hasBeenMoved = false;
        this._hasBeenZoomed = false;
        this._isMoving = false;
        this._isZooming = false;
        this._eventInitiatedByComponent = false;
        this._triggerBackgroundClick = false;
        this._externallySelectedPoint = null;
        this._zoomingToExternallySelectedPoint = false;
        this._forceExpandCluster = false;
        this._clusterBackgroundRadius = 0;
        this._selectedPoint = null;
        this._currentZoomLevel = null;
        this._firstRender = true;
        this._isDarkThemeActive = false;
        this._renderDataAnimationFrameId = null;
        this._flyToBoundsAnimationFrameId = null;
        this.events = {
            [LeafletMap.selectors.point]: {
                mouseup: this._onPointMouseUp.bind(this),
                mousedown: this._onPointMouseDown.bind(this),
                click: this._onPointClick.bind(this),
            },
        };
        this._container = container;
        this._containerSelection = select(this._container).attr('role', 'figure');
        this._container.appendChild(this.element);
        this.g
            .attr('class', root)
            .attr('aria-hidden', true);
        if (config)
            this.setConfig(config);
        if (!this._container.clientWidth) {
            console.warn('Unovis | Leaflet Map: The width of the container is not set. Setting to 100%.');
            this._containerSelection.style('width', '100%');
        }
        if (!this._container.clientHeight) {
            console.warn(`Unovis | Leaflet Map: The height of the container is not set. Setting to ${LeafletMap.DEFAULT_CONTAINER_HEIGHT}px.`);
            this._containerSelection.style('height', `${LeafletMap.DEFAULT_CONTAINER_HEIGHT}px`);
        }
        // Initialize map asynchronously
        this._leafletInitializationPromise = new Promise((resolve) => {
            setupMap(this.element, this.config).then(map$1 => {
                var _a, _b;
                // Apply the `s.map` class to `tilePane` to allow tooltip interactions
                select(map$1.leaflet.getPanes().tilePane).classed(map, true);
                if (config)
                    this.setConfig(config);
                this._map = map$1;
                this._map.leaflet.on('drag', this._onMapDragLeaflet.bind(this));
                this._map.leaflet.on('move', this._onMapMove.bind(this));
                this._map.leaflet.on('movestart', this._onMapMoveStart.bind(this));
                this._map.leaflet.on('moveend', this._onMapMoveEnd.bind(this));
                this._map.leaflet.on('zoom', this._onMapZoom.bind(this));
                this._map.leaflet.on('zoomstart', this._onMapZoomStart.bind(this));
                this._map.leaflet.on('zoomend', this._onMapZoomEnd.bind(this));
                // We need to handle background click in a special way to deal
                //   with d3 svg overlay that might have smaller size than the map itself
                //   (see this._onNodeMouseDown() and this this._onNodeMouseDown())
                this._map.leaflet.on('mousedown', () => {
                    if (!this._cancelBackgroundClick)
                        this._triggerBackgroundClick = true;
                });
                this._map.leaflet.on('mouseup', (e) => {
                    if (this._triggerBackgroundClick) {
                        this._triggerBackgroundClick = false;
                        const originalEvent = e.originalEvent;
                        this._onBackgroundClick(originalEvent.target, originalEvent);
                    }
                });
                this._map.svgOverlay
                    .attr('class', svgOverlay)
                    .insert('rect', ':first-child')
                    .attr('class', backgroundRect)
                    .attr('width', '100%')
                    .attr('height', '100%');
                this._pointGroup = this._map.svgGroup.append('g').attr('class', points);
                this._clusterBackground = this._pointGroup.append('g')
                    .attr('class', clusterBackground)
                    .call(createBackgroundNode);
                this._pointSelectionRing = this._pointGroup.append('g')
                    .attr('class', pointSelectionRing)
                    .call(createNodeSelectionRing);
                this._map.leaflet.setView(initialMapCenter, initialMapZoom);
                if (document.body.classList.contains('theme-dark') && config.styleDarkTheme) {
                    this._isDarkThemeActive = true;
                    this.setTheme(config.styleDarkTheme);
                }
                (_b = (_a = this.config).onMapInitialized) === null || _b === void 0 ? void 0 : _b.call(_a);
                resolve(this._map.leaflet);
            });
        });
        // Set data and render the map when it's ready
        this.setData(data !== null && data !== void 0 ? data : []);
        // When the container size changes we have to initiate map resize in order to update its dimensions
        this.resizeObserver = new ResizeObserver(() => {
            var _a, _b, _c;
            (_b = (_a = this._map) === null || _a === void 0 ? void 0 : _a.leaflet) === null || _b === void 0 ? void 0 : _b.invalidateSize();
            (_c = this.config.tooltip) === null || _c === void 0 ? void 0 : _c.hide();
        });
        this.resizeObserver.observe(container);
        // If dark theme is enabled, update map's style when document body's class list changes
        if (this.config.styleDarkTheme) {
            this.themeObserver = new MutationObserver((mutations) => {
                mutations.forEach(change => {
                    if (change.attributeName === 'class') {
                        const isDarkTheme = change.target.classList.contains('theme-dark');
                        if (this._isDarkThemeActive !== isDarkTheme) {
                            this.setTheme(isDarkTheme ? this.config.styleDarkTheme : this.config.style);
                            this._isDarkThemeActive = isDarkTheme;
                        }
                    }
                });
            });
            this.themeObserver.observe(document.body, { attributes: true });
        }
    }
    setConfig(config) {
        super.setConfig(config);
        if (config.width)
            this._containerSelection.style('width', isString(config.width) ? config.width : `${config.width}px`);
        if (config.height)
            this._containerSelection.style('height', isString(config.height) ? config.height : `${config.height}px`);
        if (this._map && config.renderer === LeafletMapRenderer.MapLibre) {
            const layer = this._map.layer; // Using any because the typings are not full
            const maplibreMap = layer.getMaplibreMap();
            if (maplibreMap.isStyleLoaded())
                updateTopoJson(maplibreMap, this.config);
        }
        if (this.config.tooltip) {
            this.config.tooltip.setContainer(this._container);
            this.config.tooltip.setComponents([this]);
            this.config.tooltip.update();
        }
        // Apply the `aria-label` attribute
        this._containerSelection.attr('aria-label', config.ariaLabel);
    }
    setData(data) {
        const { config, datamodel } = this;
        const dataValid = data.filter(d => {
            const lat = getNumber(d, config.pointLatitude);
            const lon = getNumber(d, config.pointLongitude);
            const valid = isFinite(lat) && isFinite(lon);
            if (!valid)
                console.warn('Unovis | Leaflet Map: Invalid point coordinates', d);
            return valid;
        });
        datamodel.data = dataValid;
        // We use Supercluster for real-time node clustering
        this._clusterIndex = calculateClusterIndex(dataValid, this.config);
        // If there was an expanded cluster, try to find its successor and expand it too
        if (this._expandedCluster && this._map.leaflet) {
            // Reset expanded cluster before calling `_getPointData()` to get data with all clusters collapsed
            const expandedCluster = this._expandedCluster;
            this._resetExpandedCluster();
            const pointData = this._getPointData();
            const expandedClusterCenterPx = projectPoint(expandedCluster.cluster, this._map.leaflet);
            const expandedClusterRadiusPx = expandedCluster.cluster.radius;
            const cluster = pointData.find((c) => {
                if (!c.isCluster)
                    return false;
                const pos = projectPoint(c, this._map.leaflet);
                const r = c.radius;
                const distance = Math.sqrt(Math.pow((expandedClusterCenterPx.x - pos.x), 2) + Math.pow((expandedClusterCenterPx.y - pos.y), 2));
                return distance < (expandedClusterRadiusPx + r);
            });
            if (cluster)
                this._expandCluster(cluster, true);
        }
        // Render
        this._leafletInitializationPromise.then(() => {
            this.render();
        });
    }
    setTheme(theme) {
        var _a;
        const layer = this._map.layer; // Using any because the typings are not full
        if (this.config.renderer === LeafletMapRenderer.MapLibre) {
            const maplibreMap = layer.getMaplibreMap();
            (_a = maplibreMap.setStyle) === null || _a === void 0 ? void 0 : _a.call(maplibreMap, theme);
            updateTopoJson(maplibreMap, this.config);
        }
        else {
            if (typeof theme !== 'string') {
                console.warn('Unovis | Leaflet Map: Invalid style. Provide a URL string for raster rendering mode.');
                return;
            }
            layer.setUrl(theme);
        }
    }
    // We redefine the ComponentCore render function to bind event to newly created elements in this._renderData(),
    // which is being called after almost every map interaction
    render() {
        const { config } = this;
        if (!this._map)
            return;
        this._renderData();
        if (this._firstRender) {
            if (config.initialBounds)
                this.fitToBounds(config.initialBounds);
            else if (config.fitViewOnInit)
                this.fitToPoints(0, config.fitViewPadding);
        }
        else {
            if (config.fitViewOnUpdate)
                this.fitToPoints(0, config.fitViewPadding);
            else if (config.fitBoundsOnUpdate)
                this.fitToBounds(config.fitBoundsOnUpdate);
        }
        this._firstRender = false;
    }
    getLeafletInstancePromise() {
        return this._leafletInitializationPromise;
    }
    fitToPoints(duration = this.config.flyToDuration, padding = this.config.fitViewPadding) {
        const { config, datamodel, datamodel: { data } } = this;
        if (!this._map || !this._map.leaflet)
            return;
        if (!(data === null || data === void 0 ? void 0 : data.length))
            return;
        const bounds = datamodel.getDataLatLngBounds(config.pointLatitude, config.pointLongitude);
        this._flyToBoundsAnimationFrameId = requestAnimationFrame(() => this._flyToBounds(bounds, duration, padding));
    }
    fitToBounds(bounds, duration = this.config.flyToDuration, padding = this.config.fitViewPadding) {
        const { northEast, southWest } = bounds;
        if (isNil(northEast) || isNil(southWest))
            return;
        if (isNil(northEast.lat) || isNil(northEast.lng))
            return;
        if (isNil(southWest.lat) || isNil(southWest.lng))
            return;
        if (!this._map || !this._map.leaflet)
            return;
        this._flyToBoundsAnimationFrameId = requestAnimationFrame(() => this._flyToBounds([
            [northEast.lat, southWest.lng],
            [southWest.lat, northEast.lng],
        ], duration, padding));
    }
    /* Select a point by id and optionally center the map view.
     * This method was designed to be used mainly with the `[LeafletMap.selectors.point]` click events
     * (when the user actually clicks on a point) and the specified point is inside one of the collapsed
     * clusters it won't be selected. You can use the `zoomToPointById` method to achieve that.
     */
    selectPointById(id, centerView = false) {
        var _a, _b, _c;
        const { config } = this;
        const pointData = this._getPointData();
        const foundPoint = pointData.find(d => d.properties.id === id);
        if (!foundPoint) {
            console.warn(`Unovis | Leaflet Map: Node with id ${id} can not be found`);
            return;
        }
        if ((_a = foundPoint.properties) === null || _a === void 0 ? void 0 : _a.cluster) {
            console.warn('Unovis | Leaflet Map: Cluster can\'t be selected');
            return;
        }
        this._selectedPoint = foundPoint;
        const isPointInsideExpandedCluster = (_c = (_b = this._expandedCluster) === null || _b === void 0 ? void 0 : _b.points) === null || _c === void 0 ? void 0 : _c.find(d => getString(d.properties, config.pointId) === id);
        if (!isPointInsideExpandedCluster)
            this._resetExpandedCluster();
        if (centerView) {
            const coordinates = {
                lng: getNumber(foundPoint.properties, config.pointLongitude),
                lat: getNumber(foundPoint.properties, config.pointLatitude),
            };
            const zoomLevel = this._map.leaflet.getZoom();
            this._eventInitiatedByComponent = true;
            this._map.leaflet.flyTo(coordinates, zoomLevel, { duration: 0 });
        }
        else {
            this._renderData();
        }
    }
    /* Get the id of the selected point */
    getSelectedPointId() {
        var _a;
        return (_a = this._selectedPoint) === null || _a === void 0 ? void 0 : _a.id;
    }
    /* Unselect point if it was selected before */
    unselectPoint() {
        this._selectedPoint = null;
        this._externallySelectedPoint = null;
        this.render();
    }
    /** Get the currently expanded cluster */
    getExpandedCluster() {
        var _a, _b;
        if (!this._expandedCluster)
            return;
        const id = (_a = this._expandedCluster.cluster) === null || _a === void 0 ? void 0 : _a.id;
        const points = (_b = this._expandedCluster.cluster) === null || _b === void 0 ? void 0 : _b.clusterPoints.map(d => this.datamodel.data[d._index]);
        return { id, points };
    }
    /* Zoom to a point by id and optionally select it.
     * If the point is inside a cluster, it'll be automatically expanded to show the enclosed point.
     * You can also force set the zoom level by providing the `customZoomLevel` argument.
     */
    zoomToPointById(id, selectPoint = false, customZoomLevel) {
        var _a, _b, _c;
        const { config, datamodel } = this;
        if (!datamodel.data.length) {
            console.warn('Unovis | Leaflet Map: There are no points on the map');
            return;
        }
        const dataBoundsAll = datamodel.getDataLatLngBounds(config.pointLatitude, config.pointLongitude);
        const bounds = [dataBoundsAll[0][1], dataBoundsAll[1][0], dataBoundsAll[1][1], dataBoundsAll[0][0]];
        const pointDataAll = this._getPointData(bounds);
        let foundPoint = pointDataAll
            .find((d) => getString(d.properties, config.pointId) === id);
        // If point was found and it's a cluster -> do nothing
        if ((_a = foundPoint === null || foundPoint === void 0 ? void 0 : foundPoint.properties) === null || _a === void 0 ? void 0 : _a.cluster) {
            console.warn('Unovis | Leaflet Map: Cluster can\'t be zoomed in');
            return;
        }
        // If point was not found -> search for it in all collapsed clusters
        if (!foundPoint) {
            const { point } = findPointAndClusterByPointId(pointDataAll, id, config.pointId);
            foundPoint = point;
        }
        if (foundPoint) {
            // If point was found and it's inside an expanded cluster -> simply select it
            const isPointInsideExpandedCluster = (_c = (_b = this._expandedCluster) === null || _b === void 0 ? void 0 : _b.points) === null || _c === void 0 ? void 0 : _c.find(d => getString(d.properties, config.pointId) === id);
            if (isPointInsideExpandedCluster && selectPoint) {
                this._selectedPoint = foundPoint;
                this._renderData();
                return;
            }
            // Else - trigger zoom
            this._externallySelectedPoint = foundPoint;
            this._zoomingToExternallySelectedPoint = true;
            this._forceExpandCluster = !isNil(customZoomLevel);
            if (selectPoint)
                this._selectedPoint = foundPoint;
            const zoomLevel = isNil(customZoomLevel) ? this._map.leaflet.getZoom() : customZoomLevel;
            const pointDatum = foundPoint.properties;
            const coordinates = {
                lng: getNumber(pointDatum, config.pointLongitude),
                lat: getNumber(pointDatum, config.pointLatitude),
            };
            this._eventInitiatedByComponent = true;
            this._map.leaflet.flyTo(coordinates, zoomLevel, { duration: 0 });
        }
        else {
            console.warn(`Unovis | Leaflet Map: Node with id ${id} can not be found`);
        }
    }
    getNodeRelativePosition(node) {
        return getNodeRelativePosition(node, this._map.leaflet);
    }
    hasBeenZoomed() {
        return this._hasBeenZoomed;
    }
    hasBeenMoved() {
        return this._hasBeenMoved;
    }
    isZooming() {
        return this._isZooming;
    }
    isMoving() {
        return this._isMoving;
    }
    _flyToBounds(bounds, durationMs, paddingPx) {
        this._eventInitiatedByComponent = true;
        const duration = durationMs / 1000;
        const padding = paddingPx ? [
            paddingPx[0] < this._container.clientWidth / 2 ? paddingPx[0] : this._container.clientWidth / 2,
            paddingPx[1] < this._container.clientHeight / 2 ? paddingPx[1] : this._container.clientHeight / 2,
        ] : undefined;
        if (duration) {
            this._map.leaflet.flyToBounds(bounds, { duration, padding });
        }
        else {
            this._map.leaflet.fitBounds(bounds, { padding });
        }
    }
    _renderData(mapMoveZoomUpdateOnly = false) {
        var _a;
        const { config } = this;
        const pointData = this._getPointData();
        const contentBBox = pointData.length ? bBoxMerge(pointData.map(d => d.bbox)) : { x: 0, y: 0, width: 0, height: 0 };
        // Set SVG size to match Leaflet transform
        const svgExtraPadding = 40 + this._clusterBackgroundRadius; // We need it to fit point labels and expanded cluster background circle
        const dx = contentBBox.x - svgExtraPadding;
        const dy = contentBBox.y - svgExtraPadding;
        this._map.svgOverlay
            .attr('width', contentBBox.width + 2 * svgExtraPadding)
            .attr('height', contentBBox.height + 2 * svgExtraPadding)
            .style('left', `${dx}px`)
            .style('top', `${dy}px`);
        this._map.svgGroup
            .attr('transform', `translate(${-dx},${-dy})`);
        // Render content
        const points = this._pointGroup.selectAll(`.${point}:not(.exit)`)
            .data(pointData, (d, i) => `${d.id || d.geometry.coordinates.join('')}`);
        points.exit().classed('exit', true).call(removeNodes);
        const pointsEnter = points.enter().append('g').attr('class', point)
            .call(createNodes);
        const pointsMerged = points.merge(pointsEnter);
        pointsEnter.call(updateNodes, config, this._map.leaflet);
        points.call(updateNodes, config, this._map.leaflet, mapMoveZoomUpdateOnly);
        pointsMerged.call(collideLabels, this._map.leaflet);
        this._clusterBackground.call(updateBackgroundNode, this._expandedCluster, config, this._map.leaflet, this._clusterBackgroundRadius);
        if (this._expandedCluster && config.clusterBackground) {
            pointData.forEach((d, i) => { var _a; d._zIndex = ((_a = d.properties) === null || _a === void 0 ? void 0 : _a.expandedClusterPoint) ? 2 : 0; });
            this._pointGroup
                .selectAll(`.${point}, .${clusterBackground}, .${pointSelectionRing}`)
                .sort((a, b) => a._zIndex - b._zIndex);
        }
        // Show selection border and hide it when the node
        // is out of visible box
        if (config.selectedPointId) {
            const foundPoint = pointData.find(d => getString(d.properties, config.pointId) === config.selectedPointId);
            const { cluster } = findPointAndClusterByPointId(pointData, config.selectedPointId, config.pointId);
            if (foundPoint)
                this._selectedPoint = foundPoint;
            else
                this._selectedPoint = cluster;
        }
        this._pointSelectionRing.call(updateNodeSelectionRing, this._selectedPoint, pointData, config, this._map.leaflet);
        // Set up events and attributes for the rendered points
        this._setUpComponentEventsThrottled();
        this._setCustomAttributesThrottled();
        // Tooltip
        (_a = config.tooltip) === null || _a === void 0 ? void 0 : _a.update();
    }
    _zoomToExternallySelectedPoint() {
        const { config } = this;
        if (!this._externallySelectedPoint)
            return;
        const externallySelectedPointDatum = this._externallySelectedPoint.properties;
        const externallySelectedPointId = getString(externallySelectedPointDatum, config.pointId);
        const pointData = this._getPointData();
        const foundPoint = pointData.find(d => getString(d.properties, config.pointId) === externallySelectedPointId);
        if (foundPoint) {
            this._zoomingToExternallySelectedPoint = false;
            this._currentZoomLevel = null;
        }
        else {
            const { cluster } = findPointAndClusterByPointId(pointData, externallySelectedPointId, config.pointId);
            if (!cluster)
                return;
            const zoomLevel = this._map.leaflet.getZoom();
            // Expand cluster or fly further
            if (this._forceExpandCluster || shouldClusterExpand(cluster, zoomLevel, 8, 13)) {
                this._expandCluster(cluster);
            }
            else {
                const newZoomLevel = getNextZoomLevelOnClusterClick(zoomLevel);
                const coordinates = {
                    lng: getNumber(externallySelectedPointDatum, config.pointLongitude),
                    lat: getNumber(externallySelectedPointDatum, config.pointLatitude),
                };
                if (this._currentZoomLevel !== newZoomLevel) {
                    this._currentZoomLevel = newZoomLevel;
                    this._eventInitiatedByComponent = true;
                    this._map.leaflet.flyTo(coordinates, newZoomLevel, { duration: 0 });
                }
            }
        }
    }
    _expandCluster(clusterPoint, preventRender) {
        var _a;
        const { config, config: { clusterBackground } } = this;
        const padding = 1;
        (_a = config.tooltip) === null || _a === void 0 ? void 0 : _a.hide();
        this._forceExpandCluster = false;
        if (clusterPoint) {
            const points = clusterPoint.clusterIndex.getLeaves(clusterPoint.properties.cluster_id, Infinity);
            const packPoints = points.map(p => ({
                x: null,
                y: null,
                r: getPointRadius(p, config.pointRadius, this._map.leaflet.getZoom()) + padding,
            }));
            packSiblings(packPoints);
            points.forEach((p, i) => {
                p.properties.expandedClusterPoint = clusterPoint;
                p.properties.r = packPoints[i].r;
                p.properties.dx = packPoints[i].x;
                p.properties.dy = packPoints[i].y;
            });
            this._resetExpandedCluster();
            this._expandedCluster = {
                cluster: clusterPoint,
                points,
            };
            if (clusterBackground)
                this._clusterBackgroundRadius = getClusterRadius(this._expandedCluster);
            if (!preventRender)
                this._renderData();
        }
        this._zoomingToExternallySelectedPoint = false;
    }
    _resetExpandedCluster() {
        var _a, _b;
        (_b = (_a = this._expandedCluster) === null || _a === void 0 ? void 0 : _a.points) === null || _b === void 0 ? void 0 : _b.forEach(d => { delete d.properties.expandedClusterPoint; });
        this._expandedCluster = null;
    }
    _getPointData(customBounds) {
        const { config, datamodel: { data } } = this;
        if (!data || !this._clusterIndex)
            return [];
        let geoJSONPoints = getClustersAndPoints(this._clusterIndex, this._map.leaflet, customBounds);
        if (this._expandedCluster) {
            // Remove expanded cluster from the data
            geoJSONPoints = geoJSONPoints.filter(c => c.properties.cluster_id !== this._expandedCluster.cluster.properties.cluster_id);
            // Add points from the expanded cluster
            geoJSONPoints = geoJSONPoints.concat(this._expandedCluster.points);
        }
        const pointData = geoJSONPoints
            // Todo: Remove explicitly set ClusterFeature<LeafletMapPointDatum<Datum>> type
            .map((d, i) => {
            return geoJsonPointToScreenPoint(d, i, this._map.leaflet, config);
        });
        // .sort((a, b) => getPointDisplayOrder(a, config.pointStatus, config.colorMap) - getPointDisplayOrder(b, config.pointStatus, config.colorMap))
        return pointData;
    }
    _getMapZoomState() {
        const leafletBounds = this._map.leaflet.getBounds();
        const southWest = leafletBounds.getSouthWest();
        const northEast = leafletBounds.getNorthEast();
        return {
            mapCenter: this._map.leaflet.getCenter(),
            zoomLevel: this._map.leaflet.getZoom(),
            bounds: { southWest, northEast },
            userDriven: !this._eventInitiatedByComponent,
        };
    }
    _onMapDragLeaflet() {
        this._cancelBackgroundClick = true;
    }
    _onMapMove() {
        var _a;
        const { config } = this;
        if (!this._map)
            return;
        this._hasBeenMoved = true;
        this._renderDataAnimationFrameId = requestAnimationFrame(() => {
            this._renderData(true);
        });
        (_a = config.onMapMoveZoom) === null || _a === void 0 ? void 0 : _a.call(config, this._getMapZoomState());
    }
    _onMapMoveStart() {
        var _a;
        const { config } = this;
        if (!this._map)
            return;
        this._isMoving = true;
        (_a = config.onMapMoveStart) === null || _a === void 0 ? void 0 : _a.call(config, this._getMapZoomState());
    }
    _onMapMoveEnd() {
        var _a, _b;
        const { config } = this;
        if (!this._map)
            return;
        (_a = this._onMapMoveEndInternal) === null || _a === void 0 ? void 0 : _a.call(this, this._map.leaflet);
        (_b = config.onMapMoveEnd) === null || _b === void 0 ? void 0 : _b.call(config, this._getMapZoomState());
        constraintMapViewThrottled(this._map.leaflet);
        const events = this._map.layer.getEvents();
        if (events.zoomend) {
            const zoomEndEvent = events.zoomend.bind(this._map.layer);
            zoomEndEvent(null);
        }
        if (this._externallySelectedPoint || this._zoomingToExternallySelectedPoint) {
            this._zoomToExternallySelectedPoint();
        }
        this._isMoving = false;
        this._eventInitiatedByComponent = false;
    }
    _onMapZoomStart() {
        var _a;
        const { config } = this;
        if (!this._map)
            return;
        this._isZooming = true;
        (_a = config.onMapZoomStart) === null || _a === void 0 ? void 0 : _a.call(config, this._getMapZoomState());
    }
    _onMapZoomEnd() {
        var _a;
        const { config } = this;
        if (!this._map)
            return;
        (_a = config.onMapZoomEnd) === null || _a === void 0 ? void 0 : _a.call(config, this._getMapZoomState());
        this._isZooming = false;
        if (!this._isMoving)
            this._eventInitiatedByComponent = false;
    }
    _onMapZoom() {
        var _a, _b;
        const { config } = this;
        if (!this._map)
            return;
        this._hasBeenZoomed = true;
        if (!this._externallySelectedPoint)
            this._resetExpandedCluster();
        else if (!this._zoomingToExternallySelectedPoint) {
            this._externallySelectedPoint = null;
        }
        (_a = config.tooltip) === null || _a === void 0 ? void 0 : _a.hide();
        (_b = config.onMapMoveZoom) === null || _b === void 0 ? void 0 : _b.call(config, this._getMapZoomState());
    }
    _onBackgroundClick(el, event) {
        var _a;
        const { config } = this;
        if (this._cancelBackgroundClick) {
            this._cancelBackgroundClick = false;
            return;
        }
        this._externallySelectedPoint = null;
        this._resetExpandedCluster();
        this._renderData();
        (_a = config.onMapClick) === null || _a === void 0 ? void 0 : _a.call(config, this._getMapZoomState());
    }
    _onPointClick(d, event) {
        const { config: { flyToDuration, clusterExpandOnClick } } = this;
        this._externallySelectedPoint = null;
        event.stopPropagation();
        if (d.properties.cluster) {
            const zoomLevel = this._map.leaflet.getZoom();
            const coordinates = { lng: d.geometry.coordinates[0], lat: d.geometry.coordinates[1] };
            if (clusterExpandOnClick && shouldClusterExpand(d, zoomLevel))
                this._expandCluster(d);
            else {
                const newZoomLevel = getNextZoomLevelOnClusterClick(zoomLevel);
                this._eventInitiatedByComponent = true;
                this._map.leaflet.flyTo(coordinates, newZoomLevel, { duration: flyToDuration / 1000 });
            }
        }
    }
    _onPointMouseDown(d, event) {
        this._cancelBackgroundClick = true;
    }
    _onPointMouseUp(d, event) {
        this._cancelBackgroundClick = false;
    }
    zoomIn(increment = 1) {
        var _a;
        if (!((_a = this._map) === null || _a === void 0 ? void 0 : _a.leaflet))
            return;
        this.setZoom(this._map.leaflet.getZoom() + increment);
    }
    zoomOut(increment = 1) {
        var _a;
        if (!((_a = this._map) === null || _a === void 0 ? void 0 : _a.leaflet))
            return;
        this.setZoom(this._map.leaflet.getZoom() - increment);
    }
    setZoom(zoomLevel) {
        var _a;
        const leaflet = (_a = this._map) === null || _a === void 0 ? void 0 : _a.leaflet;
        if (!leaflet)
            return;
        this._eventInitiatedByComponent = true;
        leaflet.flyTo(leaflet.getCenter(), clamp(zoomLevel, leaflet.getMinZoom(), leaflet.getMaxZoom()), { duration: this.config.zoomDuration / 1000 });
    }
    fitView() {
        this.fitToPoints();
    }
    destroy() {
        var _a, _b;
        constraintMapViewThrottled.cancel();
        cancelAnimationFrame(this._renderDataAnimationFrameId);
        cancelAnimationFrame(this._flyToBoundsAnimationFrameId);
        const map = (_a = this._map) === null || _a === void 0 ? void 0 : _a.leaflet;
        this._map = undefined;
        map === null || map === void 0 ? void 0 : map.stop();
        map === null || map === void 0 ? void 0 : map.remove();
        this.g.remove();
        this.resizeObserver.disconnect();
        (_b = this.themeObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
    }
}
LeafletMap.selectors = style;
LeafletMap.cssVariables = variables;
// eslint-disable-next-line @typescript-eslint/naming-convention
LeafletMap.DEFAULT_CONTAINER_HEIGHT = 600;

export { LeafletMap };
//# sourceMappingURL=index.js.map
