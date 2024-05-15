interface FlatGitignoreOptions {
    /**
     * Name of the configuration.
     * @default 'gitignore'
     */
    name?: string;
    /**
     * Path to `.gitignore` files, or files with compatible formats like `.eslintignore`.
     */
    files?: string | string[];
    /**
     * Throw an error if gitignore file not found.
     */
    strict?: boolean;
    /**
     * Mark the current working directory as the root directory,
     * disable searching for `.gitignore` files in parent directories.
     *
     * This option is not effective when `files` is explicitly specified.
     * @default false
     */
    root?: boolean;
}
interface FlatConfigItem {
    ignores: string[];
    name?: string;
}
declare function ignore(options?: FlatGitignoreOptions): FlatConfigItem;

export { type FlatConfigItem, type FlatGitignoreOptions, ignore as default };
