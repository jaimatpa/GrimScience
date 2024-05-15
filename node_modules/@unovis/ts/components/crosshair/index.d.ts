import { Selection } from 'd3-selection';
import { XYComponentCore } from "../../core/xy-component";
import { Tooltip } from "../tooltip";
import { CrosshairAccessors } from './types';
import { CrosshairConfigInterface } from './config';
import * as s from './style';
export declare class Crosshair<Datum> extends XYComponentCore<Datum, CrosshairConfigInterface<Datum>> {
    static selectors: typeof s;
    clippable: boolean;
    protected _defaultConfig: CrosshairConfigInterface<Datum>;
    config: CrosshairConfigInterface<Datum>;
    container: Selection<SVGSVGElement, any, SVGSVGElement, any>;
    line: Selection<SVGLineElement, any, SVGElement, any>;
    x: number;
    datum: Datum;
    datumIndex: number;
    show: boolean;
    private _animFrameId;
    /** Tooltip component to be used by Crosshair if not provided by the config.
     * This property is supposed to be set externally by a container component like XYContainer. */
    tooltip: Tooltip;
    /** Accessors passed externally (e.g. from XYContainer) */
    private _accessors;
    set accessors(accessors: CrosshairAccessors<Datum>);
    get accessors(): CrosshairAccessors<Datum>;
    constructor(config?: CrosshairConfigInterface<Datum>);
    setContainer(containerSvg: Selection<SVGSVGElement, unknown, SVGSVGElement, unknown>): void;
    _render(customDuration?: number): void;
    hide(): void;
    _onMouseMove(event: MouseEvent): void;
    _onMouseOut(): void;
    _showTooltip(event: MouseEvent): void;
    _hideTooltip(): void;
    getYDataExtent(): number[];
    private getCircleData;
}
