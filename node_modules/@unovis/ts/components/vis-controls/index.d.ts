import { Selection } from 'd3-selection';
import { VisControlItemInterface } from './types';
import { VisControlsConfigInterface } from './config';
export declare class VisControls {
    div: Selection<HTMLDivElement, unknown, null, undefined>;
    element: HTMLDivElement;
    protected _defaultConfig: VisControlsConfigInterface;
    config: VisControlsConfigInterface;
    protected _container: HTMLElement;
    protected _items: Selection<HTMLDivElement, unknown, null, undefined>;
    constructor(element: HTMLElement, config?: VisControlsConfigInterface);
    update(config: VisControlsConfigInterface): void;
    render(): void;
    _onItemClick(event: MouseEvent, item: VisControlItemInterface): void;
}
