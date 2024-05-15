import { ComponentCore } from "../../core/component";
import { ComponentType } from "../../types/component";
import { GenericDataRecord } from "../../types/data";
import { LeafletFlowMapConfigInterface } from './config';
import { Particle } from './types';
export declare class LeafletFlowMap<PointDatum extends GenericDataRecord, FlowDatum extends GenericDataRecord> extends ComponentCore<{
    points: PointDatum[];
    flows?: FlowDatum[];
}, LeafletFlowMapConfigInterface<PointDatum, FlowDatum>> {
    static selectors: typeof import("../leaflet-map/style");
    protected _defaultConfig: LeafletFlowMapConfigInterface<PointDatum, FlowDatum>;
    config: LeafletFlowMapConfigInterface<PointDatum, FlowDatum>;
    type: ComponentType;
    private leafletMap;
    private leafletMapInstance;
    private flows;
    private points;
    private hoveredSourcePoint;
    private onCanvasMouseMoveBound;
    private onCanvasClickBound;
    private canvasElement;
    private panningOffset;
    private resizeObserver;
    private renderer;
    particles: Particle[];
    constructor(container: HTMLDivElement, config?: LeafletFlowMapConfigInterface<PointDatum, FlowDatum>, data?: {
        points: PointDatum[];
        flows?: FlowDatum[];
    });
    setConfig(config: LeafletFlowMapConfigInterface<PointDatum, FlowDatum>): void;
    setData(data: {
        points: PointDatum[];
        flows?: FlowDatum[];
    }): void;
    render(): void;
    initParticles(): void;
    private addParticle;
    private clearParticles;
    private animate;
    private getPointByScreenPos;
    private onCanvasMouseMove;
    private onCanvasClick;
    private onMapMove;
    destroy(): void;
    selectPointById(id: string, centerPoint?: boolean): void;
    getSelectedPointId(): string | number | undefined;
    unselectPoint(): void;
    zoomToPointById(id: string, selectNode?: boolean, customZoomLevel?: number): void;
    zoomIn(increment?: number): void;
    zoomOut(increment?: number): void;
    setZoom(zoomLevel: number): void;
    fitView(): void;
}
