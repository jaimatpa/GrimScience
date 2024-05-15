import { XYComponentDefaultConfig } from '../../core/xy-component/config.js';
import { FreeBrushMode } from './types.js';

const FreeBrushDefaultConfig = Object.assign(Object.assign({}, XYComponentDefaultConfig), { 
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
    onBrush: (s, e, userDriven) => { }, 
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
    onBrushStart: (s, e, userDriven) => { }, 
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
    onBrushMove: (s, e, userDriven) => { }, 
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
    onBrushEnd: (s, e, userDriven) => { }, handleWidth: 1, selection: undefined, selectionMinLength: undefined, mode: FreeBrushMode.X, autoHide: true });

export { FreeBrushDefaultConfig };
//# sourceMappingURL=config.js.map
