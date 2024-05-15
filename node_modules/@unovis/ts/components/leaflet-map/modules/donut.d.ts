import { Selection } from 'd3-selection';
import { LeafletMapPieDatum } from '../types';
export declare function updateDonut(selection: Selection<SVGGElement, unknown, null, undefined>, data: LeafletMapPieDatum[], radius: number, arcWidth?: number, padAngle?: number): void;
