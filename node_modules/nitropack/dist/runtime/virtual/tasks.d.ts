import type { Task, TaskMeta } from "../task";
export declare const tasks: Record<string, {
    resolve?: () => Promise<Task>;
    meta: TaskMeta;
}>;
export declare const scheduledTasks: false | {
    cron: string;
    tasks: string[];
}[];
