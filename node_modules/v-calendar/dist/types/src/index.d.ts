import type { App } from 'vue';
import './styles/index.css';
import { type Defaults } from './utils/defaults';
declare const _default: {
    install: (app: App<any>, defaults?: Defaults) => void;
};
export default _default;
export * from './components';
export { setupDefaults as setupCalendar } from './utils/defaults';
export { popoverDirective } from './utils/popovers';
export { createCalendar, useCalendar } from './use/calendar';
export { createDatePicker, useDatePicker } from './use/datePicker';
