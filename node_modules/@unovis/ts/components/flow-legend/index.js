import { select } from 'd3-selection';
import { smartTransition } from '../../utils/d3.js';
import { merge } from '../../utils/data.js';
import { FlowLegendDefaultConfig } from './config.js';
import { FlowLegendItemType } from './types.js';
import { root, labels, item, arrow, label, clickable, line } from './style.js';

class FlowLegend {
    constructor(element, config) {
        this._defaultConfig = FlowLegendDefaultConfig;
        this.config = this._defaultConfig;
        this._container = element;
        this.div = select(this._container).append('div').attr('class', root);
        this.element = this.div.node();
        this.line = this.div.append('div');
        this.labels = this.div.append('div').attr('class', labels);
        if (config)
            this.update(config);
    }
    update(config) {
        this.prevConfig = this.config;
        this.config = merge(this._defaultConfig, config);
        this.render();
    }
    render() {
        const { config } = this;
        if (!config.items.length)
            return;
        if (config.customWidth)
            this.div.style('width', `${config.customWidth}px`);
        // Prepare Data
        const legendData = config.items.reduce((acc, label, i) => {
            acc.push({
                text: label,
                index: i,
                type: FlowLegendItemType.Label,
            });
            if (config.arrowSymbol && (acc.length !== config.items.length * 2 - 1)) {
                acc.push({
                    text: config.arrowSymbol,
                    index: i,
                    type: FlowLegendItemType.Symbol,
                });
            }
            return acc;
        }, []);
        // Draw
        const legendItems = this.labels.selectAll(`.${item}`)
            .data(legendData);
        const legendItemsEnter = legendItems.enter()
            .append('div')
            .attr('class', item)
            .attr('opacity', 0);
        legendItemsEnter.filter(d => d.type === FlowLegendItemType.Label)
            .on('click', this._onItemClick.bind(this));
        legendItemsEnter.append('span')
            .attr('class', d => d.type === FlowLegendItemType.Symbol
            ? arrow(config.arrowColor)
            : label(config.labelFontSize, config.labelColor))
            .classed(clickable, d => d.type === FlowLegendItemType.Label && !!config.onLegendItemClick);
        const legendItemsMerged = legendItemsEnter.merge(legendItems);
        smartTransition(legendItemsMerged, 500)
            .attr('opacity', 1);
        legendItemsMerged.select('span').html(d => d.text);
        legendItems.exit().remove();
        this.line
            .attr('class', line(config.lineColor))
            .style('opacity', config.items.length > 1 ? 1 : 0);
    }
    _onItemClick(event, d) {
        const { config } = this;
        if (config.onLegendItemClick)
            config.onLegendItemClick(d.text, d.index);
    }
}

export { FlowLegend };
//# sourceMappingURL=index.js.map
