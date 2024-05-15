import { select } from 'd3-selection';
import { ComponentCore } from '../../core/component/index.js';
import { isNumber } from '../../utils/data.js';
import { smartTransition } from '../../utils/d3.js';
import { renderTextIntoFrame } from '../../utils/text.js';
import { parseUnit } from '../../utils/misc.js';
import { UNOVIS_TEXT_DEFAULT } from '../../styles/index.js';
import { AnnotationsDefaultConfig } from './config.js';
import * as style from './style.js';
import { annotation, annotationContent, annotationSubject, variables } from './style.js';

class Annotations extends ComponentCore {
    constructor(config) {
        super();
        this._defaultConfig = AnnotationsDefaultConfig;
        this.config = this._defaultConfig;
        this.events = {};
        if (config)
            this.setConfig(config);
    }
    _render(customDuration) {
        super._render(customDuration);
        const { config } = this;
        const duration = isNumber(customDuration) ? customDuration : config.duration;
        const annotations = this.g.selectAll(`.${annotation}`)
            .data(config.items, d => JSON.stringify(d));
        const annotationsEnter = annotations.enter().append('g')
            .attr('class', annotation)
            .style('opacity', 0);
        // Content
        annotationsEnter.append('g').attr('class', annotationContent);
        // Subject
        const subject = annotationsEnter.append('g')
            .attr('class', annotationSubject);
        subject.append('circle');
        subject.append('line');
        const annotationsMerged = annotationsEnter.merge(annotations)
            .attr('cursor', d => d === null || d === void 0 ? void 0 : d.cursor)
            .each((annotation, i, elements) => {
            if (annotation.content) {
                const content = typeof annotation.content === 'string' ? Object.assign(Object.assign({}, UNOVIS_TEXT_DEFAULT), { text: annotation.content }) : annotation.content;
                const x = parseUnit(annotation.x, this._width);
                const y = parseUnit(annotation.y, this._height);
                const width = parseUnit(annotation.width, this._width);
                const height = parseUnit(annotation.height, this._height);
                const options = Object.assign(Object.assign({}, annotation), { x, y, width, height });
                const contentGroupElement = select(elements[i]).select(`.${annotationContent}`);
                renderTextIntoFrame(contentGroupElement.node(), content, options);
            }
            if (annotation.subject) {
                requestAnimationFrame(() => this._renderSubject(elements[i], annotation.subject));
            }
        });
        smartTransition(annotationsMerged, duration)
            .style('opacity', 1);
        smartTransition(annotations.exit(), duration)
            .style('opacity', 0)
            .remove();
    }
    _renderSubject(annotationGroupElement, subject) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const contentGroup = select(annotationGroupElement).select(`.${annotationContent}`);
        const subjectGroup = select(annotationGroupElement).select(`.${annotationSubject}`);
        const subjectX = (_a = parseUnit(typeof (subject === null || subject === void 0 ? void 0 : subject.x) === 'function' ? subject.x() : subject === null || subject === void 0 ? void 0 : subject.x, this._width)) !== null && _a !== void 0 ? _a : null;
        const subjectY = (_b = parseUnit(typeof (subject === null || subject === void 0 ? void 0 : subject.y) === 'function' ? subject.y() : subject === null || subject === void 0 ? void 0 : subject.y, this._height)) !== null && _b !== void 0 ? _b : null;
        const subjectStrokeColor = (_c = subject === null || subject === void 0 ? void 0 : subject.strokeColor) !== null && _c !== void 0 ? _c : null;
        const subjectFillColor = (_d = subject === null || subject === void 0 ? void 0 : subject.fillColor) !== null && _d !== void 0 ? _d : null;
        const subjectStrokeDasharray = (_e = subject === null || subject === void 0 ? void 0 : subject.strokeDasharray) !== null && _e !== void 0 ? _e : null;
        const connectorLineColor = (_f = subject === null || subject === void 0 ? void 0 : subject.connectorLineColor) !== null && _f !== void 0 ? _f : null;
        const connectorLineStrokeDasharray = (_g = subject === null || subject === void 0 ? void 0 : subject.connectorLineStrokeDasharray) !== null && _g !== void 0 ? _g : null;
        const subjectRadius = (_h = subject === null || subject === void 0 ? void 0 : subject.radius) !== null && _h !== void 0 ? _h : 0;
        const padding = (_j = subject === null || subject === void 0 ? void 0 : subject.padding) !== null && _j !== void 0 ? _j : 5;
        const contentBbox = contentGroup.node().getBBox();
        const dy = Math.abs(subjectY - (contentBbox.y + contentBbox.height / 2));
        const dx = Math.abs(subjectX - (contentBbox.x + contentBbox.width / 2));
        const annotationPadding = 5;
        const x2 = (dx < dy) && ((subjectY < contentBbox.y) || (subjectY > (contentBbox.y + contentBbox.height)))
            ? contentBbox.x + contentBbox.width / 2
            : (subjectX < contentBbox.x) ? contentBbox.x - annotationPadding : contentBbox.x + contentBbox.width + annotationPadding;
        const y2 = (dx >= dy) || ((subjectY >= contentBbox.y) && (subjectY <= (contentBbox.y + contentBbox.height)))
            ? contentBbox.y + contentBbox.height / 2
            : (subjectY < contentBbox.y) ? contentBbox.y - annotationPadding : contentBbox.y + contentBbox.height + annotationPadding;
        const angle = Math.atan2(y2 - subjectY, x2 - subjectX) * 180 / Math.PI;
        const x1 = subjectX + Math.cos(angle * Math.PI / 180) * (subjectRadius + padding);
        const y1 = subjectY + Math.sin(angle * Math.PI / 180) * (subjectRadius + padding);
        subjectGroup.select('circle')
            .attr('visibility', subject ? null : 'hidden')
            .attr('cx', subjectX)
            .attr('cy', subjectY)
            .attr('r', subjectRadius)
            .style('stroke', subjectStrokeColor)
            .style('fill', subjectFillColor)
            .style('stroke-dasharray', subjectStrokeDasharray);
        subjectGroup.select('line')
            .attr('visibility', subject ? null : 'hidden')
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x1)
            .attr('y2', y1)
            .attr('x2', x2)
            .attr('y2', y2)
            .style('stroke', connectorLineColor)
            .style('stroke-dasharray', connectorLineStrokeDasharray);
    }
}
Annotations.selectors = style;
Annotations.cssVariables = variables;

export { Annotations };
//# sourceMappingURL=index.js.map
