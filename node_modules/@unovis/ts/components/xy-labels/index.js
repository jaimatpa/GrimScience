import { XYComponentCore } from '../../core/xy-component/index.js';
import { isNumber, getValue, isNumberWithinRange } from '../../utils/data.js';
import { rectIntersect } from '../../utils/misc.js';
import { XYLabelPositioning } from './types.js';
import { XYLabelsDefaultConfig } from './config.js';
import { removeLabels, createLabels, updateLabels, getLabelRenderProps } from './modules/label.js';
import * as style from './style.js';
import { labelGroup, cluster, label } from './style.js';

// Core
class XYLabels extends XYComponentCore {
    constructor(config) {
        super();
        this.clippable = false;
        this._defaultConfig = XYLabelsDefaultConfig;
        this.config = this._defaultConfig;
        this.events = {
            [XYLabels.selectors.label]: {},
        };
        if (config)
            this.setConfig(config);
    }
    _render(customDuration) {
        const { config } = this;
        const duration = isNumber(customDuration) ? customDuration : config.duration;
        const labelGroups = this.g
            .selectAll(`.${labelGroup}`)
            .data(this._getDataToRender());
        const labelGroupsExit = labelGroups.exit();
        removeLabels(labelGroupsExit, duration);
        const labelGroupsEnter = labelGroups.enter().append('g')
            .attr('class', labelGroup)
            .call(createLabels);
        const labelGroupsMerged = labelGroupsEnter
            .merge(labelGroups)
            .classed(cluster, d => !!d.records)
            .classed(label, d => !d.records);
        labelGroupsMerged.call(updateLabels, config, duration);
    }
    _getDataToRender() {
        var _a, _b;
        const { config, datamodel } = this;
        const xRange = this.xScale.range();
        const yRange = this.xScale.range();
        const labels = (_b = (_a = datamodel.data) === null || _a === void 0 ? void 0 : _a.reduce((acc, d) => {
            const xPositioning = getValue(d, config.xPositioning);
            const yPositioning = getValue(d, config.yPositioning);
            const props = getLabelRenderProps(d, this.element, config, this.xScale, this.yScale);
            if (((xPositioning !== XYLabelPositioning.DataSpace) || isNumberWithinRange(props.x, xRange)) &&
                ((yPositioning !== XYLabelPositioning.DataSpace) || isNumberWithinRange(props.y, yRange))) {
                acc.push(Object.assign(Object.assign({}, d), { _screen: props }));
            }
            return acc;
        }, [])) !== null && _b !== void 0 ? _b : [];
        return config.clustering ? this._getClusteredLabels(labels) : labels;
    }
    _getClusteredLabels(labels) {
        const labelsNonOverlapping = [...labels];
        const clusterMap = new Map();
        for (let i = 0; i < labelsNonOverlapping.length; i += 1) {
            const label1 = labelsNonOverlapping[i];
            for (let j = i + 1; j < labelsNonOverlapping.length; j += 1) {
                const label2 = labelsNonOverlapping[j];
                const isIntersecting = rectIntersect(label1._screen, label2._screen);
                if (isIntersecting) {
                    if (!clusterMap.has(label1))
                        clusterMap.set(label1, [label1]);
                    clusterMap.get(label1).push(label2);
                    labelsNonOverlapping.splice(j, 1);
                    j -= 1;
                }
            }
            if (clusterMap.has(label1)) {
                labelsNonOverlapping.splice(i, 1);
                i -= 1;
            }
        }
        const clusters = Array.from(clusterMap.values()).map(records => ({
            _screen: getLabelRenderProps(records, this.element, this.config, this.xScale, this.yScale),
            records,
        }));
        return [...labelsNonOverlapping, ...clusters];
    }
}
XYLabels.selectors = style;

export { XYLabels };
//# sourceMappingURL=index.js.map
