import { XYComponentConfigInterface } from "../../core/xy-component/config";
import { ColorAccessor, GenericAccessor, NumericAccessor, StringAccessor } from "../../types/accessor";
import { XYLabel, XYLabelPositioning } from './types';
export interface XYLabelsConfigInterface<Datum> extends XYComponentConfigInterface<Datum> {
    /** Label color accessor function. Default: `d => d.color` */
    color?: ColorAccessor<Datum>;
    /** Single Y accessor function. Default: `undefined` */
    y: NumericAccessor<Datum>;
    /** Defines how to position the label horizontally: in data space or in screen space. Default: `XYLabelPositioning.DataSpace` */
    xPositioning?: GenericAccessor<XYLabelPositioning | string, Datum>;
    /** Defines how to position the label vertically: in data space or in screen space. Default: `XYLabelPositioning.DataSpace` */
    yPositioning?: GenericAccessor<XYLabelPositioning | string, Datum>;
    /** Font size accessor function or constant value in pixels. If not provided, the value of CSS variable `--vis-xy-label-font-size` will be used. Default: `undefined` */
    labelFontSize?: NumericAccessor<Datum>;
    /** Label accessor function or string. Default: `undefined` */
    label?: StringAccessor<Datum>;
    /** Label color. Default: `undefined` */
    backgroundColor?: ColorAccessor<Datum>;
    /** Optional label cursor. Default: `null` */
    cursor?: StringAccessor<Datum>;
    /** Label color brightness ratio for switching between dark and light text label color. Default: `0.65` */
    labelTextBrightnessRatio?: number;
    /** Enable label clustering. Default: `true` */
    clustering?: boolean;
    /** Label accessor for clusters. Default: `undefined` */
    clusterLabel?: StringAccessor<XYLabel<Datum>[]>;
    /** Font size accessor for clusters, the value is in pixels. If not provided, the value of CSS variable `--vis-xy-label-cluster-font-size` will be used. Default: `undefined` */
    clusterFontSize?: NumericAccessor<XYLabel<Datum>[]>;
    /** Background color accessor for clusters. Default: `undefined` */
    clusterBackgroundColor?: ColorAccessor<XYLabel<Datum>[]>;
    /** Optional cluster cursor. Default: `null` */
    clusterCursor?: StringAccessor<XYLabel<Datum>[]>;
    /** Cluster label color accessor function. Default: `null` */
    clusterLabelColor?: ColorAccessor<XYLabel<Datum>[]>;
}
export declare const XYLabelsDefaultConfig: XYLabelsConfigInterface<unknown>;
