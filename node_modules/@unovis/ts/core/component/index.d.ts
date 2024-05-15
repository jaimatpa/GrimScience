import { Selection } from 'd3-selection';
import { CoreDataModel } from "../../data-models/core";
import { ComponentType, Sizing } from "../../types/component";
import { Spacing } from "../../types/spacing";
import { VisEventCallback, VisEventType } from './types';
import { ComponentConfigInterface } from './config';
export declare class ComponentCore<CoreDatum, ConfigInterface extends ComponentConfigInterface = ComponentConfigInterface> {
    element: SVGGElement | HTMLElement;
    type: ComponentType;
    g: Selection<SVGGElement, unknown, null, undefined> | Selection<HTMLElement, unknown, null, undefined>;
    config: ConfigInterface;
    prevConfig: ConfigInterface;
    datamodel: CoreDataModel<CoreDatum>;
    sizing: Sizing | string;
    uid: string;
    protected events: {
        [selector: string]: {
            [eventType in VisEventType]?: VisEventCallback;
        };
    };
    /** Default configuration */
    protected _defaultConfig: ConfigInterface;
    /** Component width in pixels. This property is set automatically by the container. */
    protected _width: number;
    /** Component height in pixels. This property is set automatically by the container. */
    protected _height: number;
    /** Container width in pixels. This property is set automatically by the container. */
    protected _containerWidth: number | undefined;
    /** Container height in pixels. This property is set automatically by the container. */
    protected _containerHeight: number | undefined;
    _setUpComponentEventsThrottled: import("throttle-debounce").throttle<() => void>;
    _setCustomAttributesThrottled: import("throttle-debounce").throttle<() => void>;
    constructor(type?: ComponentType);
    setConfig(config: ConfigInterface): void;
    setData(data: CoreDatum): void;
    setSize(width: number, height: number, containerWidth: number, containerHeight: number): void;
    render(duration?: number): void;
    get bleed(): Spacing;
    _render(duration?: number): void;
    private _setCustomAttributes;
    private _setUpComponentEvents;
    private _bindEvents;
    destroy(): void;
    isDestroyed(): boolean;
}
