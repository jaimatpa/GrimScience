type MaybePromise<T> = T | Promise<T>;
/** @experimental */
export interface TaskContext {
}
/** @experimental */
export interface TaskPayload {
    [key: string]: unknown;
}
/** @experimental */
export interface TaskMeta {
    name?: string;
    description?: string;
}
/** @experimental */
export interface TaskEvent {
    name: string;
    payload: TaskPayload;
    context: TaskContext;
}
/** @experimental */
export interface TaskResult<RT = unknown> {
    result?: RT;
}
/** @experimental */
export interface Task<RT = unknown> {
    meta?: TaskMeta;
    run(event: TaskEvent): MaybePromise<{
        result?: RT;
    }>;
}
/** @experimental */
export declare function defineTask<RT = unknown>(def: Task<RT>): Task<RT>;
/** @experimental */
export declare function runTask<RT = unknown>(name: string, { payload, context, }?: {
    payload?: TaskPayload;
    context?: TaskContext;
}): Promise<TaskResult<RT>>;
/** @experimental */
export declare function startScheduleRunner(): void;
/** @experimental */
export declare function getCronTasks(cron: string): string[];
/** @experimental */
export declare function runCronTasks(cron: string, ctx: {
    payload?: TaskPayload;
    context?: TaskContext;
}): Promise<TaskResult[]>;
export {};
