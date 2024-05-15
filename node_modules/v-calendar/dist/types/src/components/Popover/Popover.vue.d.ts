import type { PopoverOptions } from '../../utils/popovers';
declare const _default: import("vue").DefineComponent<{
    id: {
        type: (SymbolConstructor | StringConstructor | NumberConstructor)[];
        required: true;
    };
    showDelay: {
        type: NumberConstructor;
        default: number;
    };
    hideDelay: {
        type: NumberConstructor;
        default: number;
    };
    boundarySelector: {
        type: StringConstructor;
    };
}, {
    popoverRef: import("vue").Ref<HTMLElement | undefined>;
    alignment: import("vue").ComputedRef<"center" | "left" | "right" | "top" | "bottom" | "middle">;
    hide: (opts?: Partial<PopoverOptions>) => void;
    setupPopper: () => void;
    beforeEnter: (el: Element) => void;
    afterEnter: (el: Element) => void;
    beforeLeave: (el: Element) => void;
    afterLeave: (el: Element) => void;
    onClick: (e: MouseEvent) => void;
    onMouseOver: () => void;
    onMouseLeave: () => void;
    onFocusIn: () => void;
    onFocusOut: (e: FocusEvent) => void;
    isVisible: import("vue").Ref<boolean>;
    target: import("vue").Ref<unknown>;
    data: import("vue").Ref<any>;
    transition: import("vue").Ref<string>;
    placement: import("vue").Ref<import("@popperjs/core").Placement>;
    direction: import("vue").Ref<string>;
    positionFixed: import("vue").Ref<false>;
    modifiers: import("vue").Ref<any[]>;
    isInteractive: import("vue").Ref<boolean>;
    visibility: import("vue").Ref<import("../../utils/popovers").PopoverVisibility>;
    isHovered: import("vue").Ref<boolean>;
    isFocused: import("vue").Ref<boolean>;
    autoHide: import("vue").Ref<boolean>;
    force: import("vue").Ref<boolean>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("before-show" | "after-show" | "before-hide" | "after-hide")[], "before-show" | "after-show" | "before-hide" | "after-hide", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    id: {
        type: (SymbolConstructor | StringConstructor | NumberConstructor)[];
        required: true;
    };
    showDelay: {
        type: NumberConstructor;
        default: number;
    };
    hideDelay: {
        type: NumberConstructor;
        default: number;
    };
    boundarySelector: {
        type: StringConstructor;
    };
}>> & {
    "onBefore-show"?: ((...args: any[]) => any) | undefined;
    "onAfter-show"?: ((...args: any[]) => any) | undefined;
    "onBefore-hide"?: ((...args: any[]) => any) | undefined;
    "onAfter-hide"?: ((...args: any[]) => any) | undefined;
}, {
    showDelay: number;
    hideDelay: number;
}>;
export default _default;
