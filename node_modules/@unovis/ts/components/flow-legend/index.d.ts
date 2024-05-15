import { Selection } from 'd3-selection';
import { FlowLegendConfigInterface } from './config';
import { FlowLegendItem } from './types';
export declare class FlowLegend {
    div: Selection<HTMLDivElement, unknown, null, undefined>;
    element: HTMLElement;
    line: Selection<HTMLDivElement, unknown, null, undefined>;
    labels: Selection<HTMLDivElement, unknown, null, undefined>;
    protected _defaultConfig: FlowLegendConfigInterface;
    config: FlowLegendConfigInterface;
    prevConfig: FlowLegendConfigInterface;
    protected _container: HTMLElement;
    constructor(element: HTMLElement, config?: FlowLegendConfigInterface);
    update(config: FlowLegendConfigInterface): void;
    render(): void;
    _onItemClick(event: MouseEvent, d: FlowLegendItem): void;
}
