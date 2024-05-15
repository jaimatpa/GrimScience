import { XYComponentDefaultConfig } from '../../core/xy-component/config.js';
import { Arrangement } from '../../types/position.js';

const BrushDefaultConfig = Object.assign(Object.assign({}, XYComponentDefaultConfig), { 
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
    onBrush: (s, e, userDriven) => { }, 
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
    onBrushStart: (s, e, userDriven) => { }, 
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
    onBrushMove: (s, e, userDriven) => { }, 
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
    onBrushEnd: (s, e, userDriven) => { }, handleWidth: 9, selection: null, draggable: false, handlePosition: Arrangement.Inside, selectionMinLength: undefined });

export { BrushDefaultConfig };
//# sourceMappingURL=config.js.map
