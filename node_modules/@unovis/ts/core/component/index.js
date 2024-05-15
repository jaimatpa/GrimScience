import { select } from 'd3-selection';
import { CoreDataModel } from '../../data-models/core.js';
import { throttle, merge } from '../../utils/data.js';
import { guid } from '../../utils/misc.js';
import { ComponentType, Sizing } from '../../types/component.js';
import { ComponentDefaultConfig } from './config.js';

class ComponentCore {
    constructor(type = ComponentType.SVG) {
        var _a, _b;
        this.type = ComponentType.SVG;
        this.datamodel = new CoreDataModel();
        this.sizing = Sizing.Fit; // Supported by SingleContainer and a subset of components only (Sankey)
        this.events = {};
        /** Default configuration */
        this._defaultConfig = ComponentDefaultConfig;
        /** Component width in pixels. This property is set automatically by the container. */
        this._width = 400;
        /** Component height in pixels. This property is set automatically by the container. */
        this._height = 200;
        /** Container width in pixels. This property is set automatically by the container. */
        this._containerWidth = undefined;
        /** Container height in pixels. This property is set automatically by the container. */
        this._containerHeight = undefined;
        this._setUpComponentEventsThrottled = throttle(this._setUpComponentEvents, 500);
        this._setCustomAttributesThrottled = throttle(this._setCustomAttributes, 500);
        if (type === ComponentType.SVG) {
            this.element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        }
        else {
            this.element = document.createElement('div');
        }
        this.uid = guid();
        this.g = select(this.element);
        // Setting the root class if available
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line dot-notation
        const rootClass = (_b = (_a = this.constructor) === null || _a === void 0 ? void 0 : _a['selectors']) === null || _b === void 0 ? void 0 : _b.root;
        if (rootClass)
            this.g.attr('class', rootClass);
    }
    setConfig(config) {
        this.prevConfig = this.config; // Store the previous config instance
        this.config = merge(this._defaultConfig, config);
    }
    setData(data) {
        this.datamodel.data = data;
    }
    setSize(width, height, containerWidth, containerHeight) {
        if (isFinite(width))
            this._width = width;
        if (isFinite(height))
            this._height = height;
        if (isFinite(containerWidth))
            this._containerWidth = containerWidth;
        if (isFinite(containerHeight))
            this._containerHeight = containerHeight;
    }
    render(duration = this.config.duration) {
        this._render(duration);
        // While transition is in progress, we add the 'animating' attribute to the component's SVG group
        const ANIMATING_ATTR = 'animating';
        if (duration) {
            this.g.attr(ANIMATING_ATTR, '');
            const transition = this.g
                .transition(ANIMATING_ATTR)
                .duration(duration);
            transition.on('end interrupt', () => {
                this.g.attr(ANIMATING_ATTR, null);
            });
        }
        this._setUpComponentEventsThrottled();
        this._setCustomAttributesThrottled();
    }
    get bleed() {
        return { top: 0, bottom: 0, left: 0, right: 0 };
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    _render(duration = this.config.duration) {
    }
    _setCustomAttributes() {
        const attributeMap = this.config.attributes;
        Object.keys(attributeMap).forEach(className => {
            Object.keys(attributeMap[className]).forEach(attr => {
                const selection = this.g
                    .selectAll(`.${className}`);
                selection.attr(attr, attributeMap[className][attr]);
            });
        });
    }
    _setUpComponentEvents() {
        // Set up default events
        this._bindEvents(this.events);
        // Set up user-defined events
        this._bindEvents(this.config.events, '.user');
    }
    _bindEvents(events = this.events, suffix = '') {
        Object.keys(events).forEach(className => {
            Object.keys(events[className]).forEach(eventType => {
                const selection = this.g
                    .selectAll(`.${className}`);
                selection.on(eventType + suffix, (event, d) => {
                    const els = selection.nodes();
                    const i = els.indexOf(event.currentTarget);
                    const eventFunction = events[className][eventType];
                    return eventFunction === null || eventFunction === void 0 ? void 0 : eventFunction(d, event, i, els);
                });
            });
        });
    }
    destroy() {
        var _a;
        (_a = this.g) === null || _a === void 0 ? void 0 : _a.remove();
        this.element = undefined;
    }
    isDestroyed() {
        return !this.element;
    }
}

export { ComponentCore };
//# sourceMappingURL=index.js.map
