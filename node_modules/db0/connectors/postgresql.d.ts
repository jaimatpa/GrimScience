import { ClientConfig } from "pg";
import type { Connector } from "../types";
export type ConnectorOptions = {
    url: string;
} | ClientConfig;
export default function sqliteConnector(opts: ConnectorOptions): Connector;
