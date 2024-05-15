import { select } from 'd3-selection';
import { merge } from '../../utils/data.js';
import { VisControlsOrientation } from './types.js';
import { VisControlsDefaultConfig } from './config.js';
import { root, items, horizontalItems, item, itemButton, borderLeft, borderTop, borderRight, borderBottom, disabled } from './style.js';

class VisControls {
    constructor(element, config) {
        this._defaultConfig = VisControlsDefaultConfig;
        this.config = this._defaultConfig;
        this._container = element;
        this.div = select(this._container)
            .append('div')
            .attr('class', root);
        this.element = this.div.node();
        this._items = this.div.append('div')
            .attr('class', items);
        if (config)
            this.update(config);
    }
    update(config) {
        this.config = merge(this._defaultConfig, config);
        this.render();
    }
    render() {
        const { config: { items, orientation } } = this;
        this._items
            .classed(horizontalItems, orientation === VisControlsOrientation.Horizontal);
        const controlItems = this._items.selectAll(`.${item}`)
            .data(items);
        const controlItemsEnter = controlItems.enter()
            .append('div')
            .attr('class', item)
            .on('click', this._onItemClick.bind(this));
        controlItemsEnter.append('button')
            .attr('class', itemButton);
        const controlItemsMerged = controlItemsEnter.merge(controlItems);
        controlItemsMerged
            .classed(borderLeft, d => d.borderLeft)
            .classed(borderTop, d => d.borderTop)
            .classed(borderRight, d => d.borderRight)
            .classed(borderBottom, d => d.borderBottom)
            .classed(disabled, d => d.disabled);
        controlItemsMerged.select(`.${itemButton}`)
            .html(item => item.icon);
        controlItems.exit().remove();
    }
    _onItemClick(event, item) {
        var _a;
        (_a = item.callback) === null || _a === void 0 ? void 0 : _a.call(item, event);
    }
}

export { VisControls };
//# sourceMappingURL=index.js.map
