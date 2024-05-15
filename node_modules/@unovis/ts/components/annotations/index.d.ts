import { Selection } from 'd3-selection';
import { ComponentCore } from "../../core/component";
import { AnnotationsConfigInterface } from './config';
import * as s from './style';
export declare class Annotations extends ComponentCore<unknown[], AnnotationsConfigInterface> {
    static selectors: typeof s;
    static cssVariables: {
        annotationsTextColor: "--vis-annotations-text-color";
        annotationsConnectorStrokeColor: "--vis-annotations-connector-stroke-color";
        annotationsConnectorStrokeWidth: "--vis-annotations-connector-stroke-width";
        annotationsConnectorStrokeDasharray: "--vis-annotations-connector-stroke-dasharray";
        annotationsSubjectStrokeColor: "--vis-annotations-subject-stroke-color";
        annotationsSubjectFillColor: "--vis-annotations-subject-fill-color";
        annotationsSubjectStrokeDasharray: "--vis-annotations-subject-stroke-dasharray";
        darkAnnotationsTextColor: "--vis-dark-annotations-text-color";
        darkAnnotationsConnectorStrokeColor: "--vis-dark-annotations-connector-stroke-color";
        darkAnnotationsSubjectStrokeColor: "--vis-dark-annotations-subject-stroke-color";
    };
    protected _defaultConfig: AnnotationsConfigInterface;
    config: AnnotationsConfigInterface;
    g: Selection<SVGGElement, unknown, null, undefined>;
    events: {};
    constructor(config?: AnnotationsConfigInterface);
    _render(customDuration?: number): void;
    private _renderSubject;
}
