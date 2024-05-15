type Primitive = string | number | boolean | undefined | null;
type Statement = {
    bind(...params: Primitive[]): Statement;
    all(...params: Primitive[]): Promise<unknown[]>;
    run(...params: Primitive[]): Promise<{
        success: boolean;
    }>;
    get(...params: Primitive[]): Promise<unknown>;
};
type ExecResult = unknown;
type Connector = {
    name: string;
    exec: (sql: string) => ExecResult | Promise<ExecResult>;
    prepare: (sql: string) => Statement;
};
type DefaultSQLResult = {
    lastInsertRowid?: number;
    changes?: number;
    error?: string;
    rows?: {
        id?: string | number;
        [key: string]: unknown;
    }[];
};
interface Database {
    exec: (sql: string) => Promise<ExecResult>;
    prepare: (sql: string) => Statement;
    sql: <T = DefaultSQLResult>(strings: TemplateStringsArray, ...values: Primitive[]) => Promise<T>;
}

declare function createDatabase(connector: Connector): Database;

declare const connectors: {
    readonly sqlite: "db0/connectors/better-sqlite3";
    readonly postgresql: "db0/connectors/postgresql";
    readonly "cloudflare-d1": "db0/connectors/cloudflare-d1";
    readonly libsql: "db0/connectors/libsql/node";
    readonly "libsql-node": "db0/connectors/libsql/node";
    readonly "libsql-http": "db0/connectors/libsql/http";
    readonly "libsql-web": "db0/connectors/libsql/web";
    readonly bun: "db0/connectors/bun-sqlite";
    readonly "bun-sqlite": "db0/connectors/bun-sqlite";
};
type ConnectorName = keyof typeof connectors;

export { type Connector, type ConnectorName, type Database, type ExecResult, type Primitive, type Statement, connectors, createDatabase };
