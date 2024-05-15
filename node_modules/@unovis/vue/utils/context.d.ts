import { XYComponentCore, ComponentCore, Tooltip, Crosshair, Axis, Annotations } from '@unovis/ts';
import { InjectionKey, Ref } from 'vue';
export declare const componentAccessorKey: InjectionKey<{
    data: Ref<any>;
    update: (c: XYComponentCore<any> | ComponentCore<any>) => void;
    destroy: () => void;
}>;
export declare const tooltipAccessorKey: InjectionKey<{
    data: Ref<any>;
    update: (c: Tooltip) => void;
    destroy: () => void;
}>;
export declare const crosshairAccessorKey: InjectionKey<{
    data: Ref<any>;
    update: (c: Crosshair<any>) => void;
    destroy: () => void;
}>;
export declare const axisAccessorKey: InjectionKey<{
    data: Ref<any>;
    update: (c: Axis<any>) => void;
    destroy: (c: string) => void;
}>;
export declare const annotationsAccessorKey: InjectionKey<{
    data: Ref<any>;
    update: (c: Annotations) => void;
    destroy: () => void;
}>;
