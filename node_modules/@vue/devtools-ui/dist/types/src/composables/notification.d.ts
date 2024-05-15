export type VueNotificationPlacement = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export interface VueNotificationOptions {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    classes?: string;
    duration?: number;
    placement?: VueNotificationPlacement;
    onClose?: () => void;
}
export declare function showVueNotification(options: VueNotificationOptions): void;
