import type { Placement } from '@popperjs/core';
import type { Directive } from 'vue';
export type PopoverVisibility = 'click' | 'hover' | 'hover-focus' | 'focus';
export interface PopoverOptions {
    id: PropertyKey;
    visibility: PopoverVisibility;
    isInteractive: boolean;
    autoHide: boolean;
    force: boolean;
    target: unknown;
    placement: Placement;
    modifiers: any;
    data: any;
    showDelay: number;
    hideDelay: number;
}
export interface PopoverState {
    isVisible: boolean;
    target: unknown;
    data: any;
    transition: string;
    placement: Placement;
    direction: string;
    positionFixed: false;
    modifiers: any[];
    isInteractive: boolean;
    visibility: PopoverVisibility;
    isHovered: boolean;
    isFocused: boolean;
    autoHide: boolean;
    force: boolean;
}
export interface PopoverEvent {
    detail: Partial<PopoverOptions>;
}
export interface PopoverEventHandlers {
    click: (e: MouseEvent) => void;
    mousemove: (e: MouseEvent) => void;
    mouseleave: (e: MouseEvent) => void;
    focusin: (e: MouseEvent) => void;
    focusout: (e: MouseEvent) => void;
}
export declare function showPopover(opts: Partial<PopoverOptions>): void;
export declare function hidePopover(opts: Partial<PopoverOptions>): void;
export declare function togglePopover(opts: Partial<PopoverOptions>): void;
export declare function getPopoverEventHandlers(opts: Partial<PopoverOptions>): Partial<PopoverEventHandlers>;
export declare const popoverDirective: Directive;
