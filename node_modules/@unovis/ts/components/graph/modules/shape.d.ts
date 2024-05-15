import { Selection } from 'd3-selection';
import { NumericAccessor, StringAccessor } from "../../../types/accessor";
export declare function appendShape<T>(selection: Selection<SVGGElement, T, SVGGElement, unknown>, shapeAccessor: StringAccessor<T>, shapeSelector: string, customShapeSelector: string, index?: number, insertSelector?: string): void;
export declare function updateShape<T>(selection: Selection<SVGGElement, T, SVGGElement, unknown>, shape: StringAccessor<T>, size: NumericAccessor<T>, index: number): void;
