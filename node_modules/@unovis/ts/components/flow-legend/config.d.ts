export interface FlowLegendConfigInterface {
    /** Custom width of the component.  Default: `undefined` */
    customWidth?: number;
    /** Legend items array as string[]. Default: `[]` */
    items?: string[];
    /** Color of the flow line. Default: `undefined` */
    lineColor?: string;
    /** Color of the flow label. Default: `undefined` */
    labelColor?: string;
    /** Font size of flow labels in pixels. Default: `12` */
    labelFontSize?: number;
    /** Arrow symbol. Default: `'▶'` */
    arrowSymbol?: string;
    /** Color of the arrow. Default: `undefined` */
    arrowColor?: string;
    /** Callback function for the legend item click. Default: `undefined` */
    onLegendItemClick?: ((label?: string, i?: number) => void);
}
export declare const FlowLegendDefaultConfig: FlowLegendConfigInterface;
