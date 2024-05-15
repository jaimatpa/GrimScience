import type { H3Error } from 'h3';
export declare const NUXT_ERROR_SIGNATURE = "__nuxt_error";
/** @since 3.0.0 */
export declare const useError: () => import("vue").Ref<NuxtError<unknown> | null | undefined>;
export interface NuxtError<DataT = unknown> extends H3Error<DataT> {
}
/** @since 3.0.0 */
export declare const showError: <DataT = unknown>(error: string | Error | (Partial<NuxtError<DataT>> & {
    status?: number;
    statusText?: string;
})) => NuxtError<DataT>;
/** @since 3.0.0 */
export declare const clearError: (options?: {
    redirect?: string;
}) => Promise<void>;
/** @since 3.0.0 */
export declare const isNuxtError: <DataT = unknown>(error?: string | object) => error is NuxtError<DataT>;
/** @since 3.0.0 */
export declare const createError: <DataT = unknown>(error: string | Error | (Partial<NuxtError<DataT>> & {
    status?: number;
    statusText?: string;
})) => NuxtError<DataT>;
