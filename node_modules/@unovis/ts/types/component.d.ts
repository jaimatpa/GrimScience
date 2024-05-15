export declare enum ComponentType {
    SVG = 0,
    HTML = 1
}
export declare enum Sizing {
    Fit = "fit",
    Extend = "extend",
    FitWidth = "fit_width"
}
export interface ExtendedSizeComponent {
    getWidth?(): number;
    getHeight?(): number;
}
