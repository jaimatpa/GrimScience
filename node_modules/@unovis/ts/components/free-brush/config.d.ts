import { D3BrushEvent } from 'd3-brush';
import { XYComponentConfigInterface } from "../../core/xy-component/config";
import { FreeBrushMode, FreeBrushSelection } from './types';
export interface FreeBrushConfigInterface<Datum> extends Partial<XYComponentConfigInterface<Datum>> {
    /** Brush selection mode. X - horizontal, Y - vertical, XY - both. Default: `FreeBrushMode.X` */
    mode?: FreeBrushMode;
    /** Callback function to be called on any Brush event.
     * Default: `(selection: FreeBrushSelection, event: D3BrushEvent<Datum>, userDriven: boolean): void => {}`
    */
    onBrush?: ((selection: FreeBrushSelection | undefined, event: D3BrushEvent<unknown>, userDriven: boolean) => void);
    /** Callback function to be called on the Brush start event.
     * Default: `(selection: FreeBrushSelection, event: D3BrushEvent<unknown>, userDriven: boolean): void => {}`
    */
    onBrushStart?: ((selection: FreeBrushSelection | undefined, event: D3BrushEvent<unknown>, userDriven: boolean) => void);
    /** Callback function to be called on the Brush move event.
     * Default: `(selection: FreeBrushSelection, event: D3BrushEvent<unknown>, userDriven: boolean): void => {}`
    */
    onBrushMove?: ((selection: FreeBrushSelection | undefined, event: D3BrushEvent<unknown>, userDriven: boolean) => void);
    /** Callback function to be called on the Brush end event.
     * Default: `(selection: FreeBrushSelection, event: D3BrushEvent<unknown>, userDriven: boolean)L void => {}`
    */
    onBrushEnd?: ((selection: FreeBrushSelection | undefined, event: D3BrushEvent<unknown>, userDriven: boolean) => void);
    /** Width of the Brush handle. Default: `1` */
    handleWidth?: number;
    /** Brush selection in data space, can be used to force set the selection from outside.
     * In case of two dimensional mode, the selection has the following format: `[[xMin, xMax], [yMin, yMax]]`.
     * This config property gets updated on internal brush events. Default: `undefined`
    */
    selection?: FreeBrushSelection | null | undefined;
    /** Constraint Brush selection to a minimal length in data units. Default: `undefined` */
    selectionMinLength?: number | [number, number];
    /** Automatically hide the brush after selection. Default: `true` */
    autoHide?: boolean;
}
export declare const FreeBrushDefaultConfig: FreeBrushConfigInterface<unknown>;
