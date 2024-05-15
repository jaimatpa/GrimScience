import { brush as brush$1, brushY, brushX } from 'd3-brush';
import { XYComponentCore } from '../../core/xy-component/index.js';
import { isNumber, isArray, clamp } from '../../utils/data.js';
import { smartTransition } from '../../utils/d3.js';
import { FreeBrushMode } from './types.js';
import { FreeBrushDefaultConfig } from './config.js';
import * as style from './style.js';
import { brush, hide } from './style.js';

class FreeBrush extends XYComponentCore {
    constructor(config) {
        super();
        this._defaultConfig = FreeBrushDefaultConfig;
        this.config = this._defaultConfig;
        this._firstRender = true;
        if (config)
            this.setConfig(config);
        this.brush = this.g
            .append('g')
            .attr('class', brush);
    }
    _render(customDuration) {
        const { config } = this;
        const xScale = this.xScale;
        const yScale = this.yScale;
        const duration = isNumber(customDuration) ? customDuration : config.duration;
        if (this._firstRender)
            this.brush.classed(hide, this._firstRender && config.autoHide);
        // Sometimes Brush stops emitting 'start' and 'end' events. Possible explanation:
        // "... mouseup will only fire when performed within the browser, which can lead to losing track of the button state."
        // https://stackoverflow.com/a/48970682
        //
        // D3 code related to the problem:
        // https://github.com/d3/d3-brush/blob/ec2bce6f15074a9ead7f9a84c61335be51c123a3/src/brush.js#L301
        //
        // We're clearing brush's event emitter state to force it to get re-initialized
        // Caveat of this solution: If you're doing a brush selection and a render happens
        // (e.g. due to a data or config update), it'll reset the brush.
        //
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (this.brush.node().__brush)
            this.brush.node().__brush.emitter = undefined;
        this.brushBehaviour = this._getBrushBehaviour(config.mode);
        this.brushBehaviour
            .handleSize(config.handleWidth)
            .extent([[0, 0], [this._width, this._height]])
            .on('start', this._onBrushStart.bind(this))
            .on('brush', this._onBrushMove.bind(this))
            .on('end', this._onBrushEnd.bind(this));
        this.brush
            .call(this.brushBehaviour);
        // Calculate the brush range from configured selection and apply it
        let brushRange;
        switch (config.mode) {
            case FreeBrushMode.XY: {
                const selection = config.selection;
                const xSelectionRange = this._dataRangeToPixelRange([selection === null || selection === void 0 ? void 0 : selection[0][0], selection === null || selection === void 0 ? void 0 : selection[0][1]], xScale);
                const ySelectionRange = this._dataRangeToPixelRange([selection === null || selection === void 0 ? void 0 : selection[1][0], selection === null || selection === void 0 ? void 0 : selection[1][1]], yScale, true);
                brushRange = (xSelectionRange && ySelectionRange) ? [[xSelectionRange[0], ySelectionRange[0]], [xSelectionRange[1], ySelectionRange[1]]] : null;
                break;
            }
            case FreeBrushMode.X:
            case FreeBrushMode.Y:
            default: {
                const scale = config.mode === FreeBrushMode.Y ? yScale : xScale;
                brushRange = this._dataRangeToPixelRange(config.selection, scale, config.mode === FreeBrushMode.Y);
            }
        }
        smartTransition(this.brush, duration)
            .call(this.brushBehaviour.move, brushRange) // Sets up the brush and calls brush events
            .on('end interrupt', () => { this._firstRender = false; });
        if (!duration)
            this._firstRender = false;
    }
    _onBrush(event) {
        const { config } = this;
        const userDriven = !!(event === null || event === void 0 ? void 0 : event.sourceEvent);
        // Selection from the brush events is in Screen Space (pixels)
        // In case of two dimensional brush is comes as [ [xMinPx, yMinPx], [xMaxPx, yMaxPx] ],
        //   while in the config we'll be storing it as [ [xMin, xMax], [yMin, yMax] ]
        const s = (event === null || event === void 0 ? void 0 : event.selection);
        if (!this._isSelectionValid(s)) {
            config.selection = null;
            return;
        }
        // Convert the raw brush selection from pixels to data units, store it in the config and trigger the onBrush callback
        let selectedDomain;
        switch (config.mode) {
            case FreeBrushMode.XY: {
                const selection = s;
                const xSelection = this._pixelRangeToDataRange([selection[0][0], selection[1][0]], this.xScale, isArray(config.selectionMinLength) ? config.selectionMinLength[0] : config.selectionMinLength);
                const ySelection = this._pixelRangeToDataRange([selection[0][1], selection[1][1]], this.yScale, isArray(config.selectionMinLength) ? config.selectionMinLength[1] : config.selectionMinLength, true);
                selectedDomain = (xSelection && ySelection) ? [
                    [xSelection === null || xSelection === void 0 ? void 0 : xSelection[0], xSelection === null || xSelection === void 0 ? void 0 : xSelection[1]],
                    [ySelection === null || ySelection === void 0 ? void 0 : ySelection[0], ySelection === null || ySelection === void 0 ? void 0 : ySelection[1]],
                ] : null;
                break;
            }
            case FreeBrushMode.Y: {
                selectedDomain = this._pixelRangeToDataRange(s, this.yScale, isArray(config.selectionMinLength) ? config.selectionMinLength[1] : config.selectionMinLength, true);
                break;
            }
            case FreeBrushMode.X:
            default: {
                selectedDomain = this._pixelRangeToDataRange(s, this.xScale, isArray(config.selectionMinLength) ? config.selectionMinLength[0] : config.selectionMinLength);
                break;
            }
        }
        if (selectedDomain === null || selectedDomain[0] === null || selectedDomain[1] === null) {
            this.brush.call(this.brushBehaviour.move, null);
            return;
        }
        config.selection = selectedDomain;
        if (!this._firstRender)
            config.onBrush(selectedDomain, event, userDriven);
    }
    _pixelRangeToDataRange(selectionInPixels, scale, constraint, reversed) {
        const selectedDomain = selectionInPixels.map(n => scale.invert(n));
        if (reversed)
            selectedDomain.reverse();
        const domain = scale.domain();
        const domainLength = Math.abs(domain[1] - domain[0]);
        const selectionLength = Math.abs(selectedDomain[1] - selectedDomain[0]);
        if (constraint >= domainLength) {
            console.warn('Unovis | FreeBrush: Configured domain constraint is bigger than the brush domain');
        }
        if ((selectionLength < constraint) && (constraint < domainLength))
            return null;
        else
            return selectedDomain;
    }
    _dataRangeToPixelRange(selectionInDataUnits, scale, reversed) {
        var _a, _b;
        if (!selectionInDataUnits)
            return null;
        const range = scale.range();
        const s = [...selectionInDataUnits];
        if (reversed) {
            range.reverse();
            s.reverse();
        }
        const selectionMin = clamp((_a = scale(s[0])) !== null && _a !== void 0 ? _a : 0, range[0], range[1]);
        const selectionMax = clamp((_b = scale(s[1])) !== null && _b !== void 0 ? _b : 0, range[0], range[1]);
        return (selectionMax - selectionMin) ? [selectionMin, selectionMax] : null;
    }
    _isSelectionValid(s) {
        const { config } = this;
        if (config.mode === FreeBrushMode.XY) {
            return s && Array.isArray(s[0]) && Array.isArray(s[1]);
        }
        else {
            return s && isNumber(s[0]) && isNumber(s[1]);
        }
    }
    _getBrushBehaviour(mode) {
        switch (mode) {
            case FreeBrushMode.X: return brushX();
            case FreeBrushMode.Y: return brushY();
            default: return brush$1();
        }
    }
    _onBrushStart(event) {
        var _a;
        const { config } = this;
        const userDriven = !!(event === null || event === void 0 ? void 0 : event.sourceEvent);
        this._onBrush(event);
        if (config.autoHide && userDriven)
            this.brush.classed(hide, false);
        if (!this._firstRender)
            (_a = config.onBrushStart) === null || _a === void 0 ? void 0 : _a.call(config, config.selection, event, userDriven);
    }
    _onBrushMove(event) {
        var _a;
        const { config } = this;
        this._onBrush(event);
        if (!this._firstRender)
            (_a = config.onBrushMove) === null || _a === void 0 ? void 0 : _a.call(config, config.selection, event, !!(event === null || event === void 0 ? void 0 : event.sourceEvent));
    }
    _onBrushEnd(event) {
        var _a;
        const { config } = this;
        this._onBrush(event);
        if (config.autoHide)
            this.brush.classed(hide, true);
        if (!this._firstRender)
            (_a = config.onBrushEnd) === null || _a === void 0 ? void 0 : _a.call(config, config.selection, event, !!(event === null || event === void 0 ? void 0 : event.sourceEvent));
    }
}
FreeBrush.selectors = style;

export { FreeBrush };
//# sourceMappingURL=index.js.map
