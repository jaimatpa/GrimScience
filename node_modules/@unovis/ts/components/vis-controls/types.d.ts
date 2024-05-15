export interface VisControlItemInterface {
    icon: string;
    callback?: (event: MouseEvent) => any;
    disabled?: boolean;
    borderLeft?: boolean;
    borderTop?: boolean;
    borderRight?: boolean;
    borderBottom?: boolean;
}
export declare enum VisControlsOrientation {
    Horizontal = "horizontal",
    Vertical = "vertical"
}
