import { Particle } from './types';
export declare class PointRenderer {
    private width;
    private height;
    private devicePixelRatio;
    private containerNode;
    private renderer;
    private rendererCanvasElement;
    private readonly camera;
    private readonly scene;
    private pointsGeometry;
    private pointsBuffer;
    private pointsPositions;
    private pointsColors;
    private pointsSizes;
    private pointData;
    constructor(containerNode: HTMLDivElement, width: number, height: number, canvas?: HTMLCanvasElement);
    private initGeometry;
    private initPointsAttributes;
    draw(): void;
    update(points: Particle[]): void;
    updatePointsPosition(points: Particle[]): void;
    setSize(width: number, height: number): void;
    getCanvasElement(): HTMLCanvasElement;
    destroy(): void;
}
