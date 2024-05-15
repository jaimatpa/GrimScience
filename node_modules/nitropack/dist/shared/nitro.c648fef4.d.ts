import { Preset } from 'unenv';
import { Unimport } from 'unimport';
import { UnimportPluginOptions } from 'unimport/unplugin';
import { PluginVisualizerOptions } from 'rollup-plugin-visualizer';
import { Hookable, NestedHooks } from 'hookable';
import { consola, ConsolaInstance, LogLevel } from 'consola';
import { WatchOptions } from 'chokidar';
import { RollupCommonJSOptions } from '@rollup/plugin-commonjs';
import { Storage, BuiltinDriverName } from 'unstorage';
import { ProxyServerOptions } from 'httpxy';
import { RouterMethod, H3Event, EventHandler, H3Error, ProxyOptions } from 'h3';
import { C12InputConfig, ResolvedConfig, ConfigWatcher } from 'c12';
import { UnwasmPluginOptions } from 'unwasm/plugin';
import { readPackageJSON, writePackageJSON, TSConfig } from 'pkg-types';
import { ConnectorName } from 'db0';
import { NodeFileTraceOptions } from '@vercel/nft';
import { InputOptions, OutputOptions } from 'rollup';
import { TransformOptions, Loader } from 'esbuild';
import { FilterPattern } from '@rollup/pluginutils';
import { existsSync } from 'node:fs';
import { dirname, resolve, basename, join, relative } from 'pathe';
import chalk from 'chalk';
import { isDebug, isTest } from 'std-env';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import fsp from 'node:fs/promises';
import { HttpsOptions } from 'firebase-functions/v2/https';
import { region, RuntimeOptions } from 'firebase-functions';
import { FetchRequest, FetchOptions, FetchResponse } from 'ofetch';

type MatchResult<Key extends string, Exact extends boolean = false, Score extends any[] = [], catchAll extends boolean = false> = {
    [k in Key]: {
        key: k;
        exact: Exact;
        score: Score;
        catchAll: catchAll;
    };
}[Key];
type Subtract<Minuend extends any[] = [], Subtrahend extends any[] = []> = Minuend extends [...Subtrahend, ...infer Remainder] ? Remainder : never;
type TupleIfDiff<First extends string, Second extends string, Tuple extends any[] = []> = First extends `${Second}${infer Diff}` ? Diff extends "" ? [] : Tuple : [];
type MaxTuple<N extends any[] = [], T extends any[] = []> = {
    current: T;
    result: MaxTuple<N, ["", ...T]>;
}[[N["length"]] extends [Partial<T>["length"]] ? "current" : "result"];
type CalcMatchScore<Key extends string, Route extends string, Score extends any[] = [], Init extends boolean = false, FirstKeySegMatcher extends string = Init extends true ? ":Invalid:" : ""> = `${Key}/` extends `${infer KeySeg}/${infer KeyRest}` ? KeySeg extends FirstKeySegMatcher ? Subtract<[
    ...Score,
    ...TupleIfDiff<Route, Key, ["", ""]>
], TupleIfDiff<Key, Route, ["", ""]>> : `${Route}/` extends `${infer RouteSeg}/${infer RouteRest}` ? `${RouteSeg}?` extends `${infer RouteSegWithoutQuery}?${string}` ? RouteSegWithoutQuery extends KeySeg ? CalcMatchScore<KeyRest, RouteRest, [...Score, "", ""]> : KeySeg extends `:${string}` ? RouteSegWithoutQuery extends "" ? never : CalcMatchScore<KeyRest, RouteRest, [...Score, ""]> : KeySeg extends RouteSegWithoutQuery ? CalcMatchScore<KeyRest, RouteRest, [...Score, ""]> : never : never : never : never;
type _MatchedRoutes<Route extends string, MatchedResultUnion extends MatchResult<string> = MatchResult<keyof InternalApi>> = MatchedResultUnion["key"] extends infer MatchedKeys ? MatchedKeys extends string ? Route extends MatchedKeys ? MatchResult<MatchedKeys, true> : MatchedKeys extends `${infer Root}/**${string}` ? MatchedKeys extends `${string}/**` ? Route extends `${Root}/${string}` ? MatchResult<MatchedKeys, false, [], true> : never : MatchResult<MatchedKeys, false, CalcMatchScore<Root, Route, [], true>> : MatchResult<MatchedKeys, false, CalcMatchScore<MatchedKeys, Route, [], true>> : never : never;
type MatchedRoutes<Route extends string, MatchedKeysResult extends MatchResult<string> = MatchResult<keyof InternalApi>, Matches extends MatchResult<string> = _MatchedRoutes<Route, MatchedKeysResult>> = Route extends "/" ? keyof InternalApi : Extract<Matches, {
    exact: true;
}> extends never ? Extract<Exclude<Matches, {
    score: never;
}>, {
    score: MaxTuple<Matches["score"]>;
}>["key"] | Extract<Matches, {
    catchAll: true;
}>["key"] : Extract<Matches, {
    exact: true;
}>["key"];
type KebabCase<T extends string, A extends string = ""> = T extends `${infer F}${infer R}` ? KebabCase<R, `${A}${F extends Lowercase<F> ? "" : "-"}${Lowercase<F>}`> : A;

interface InternalApi {
}
type NitroFetchRequest = Exclude<keyof InternalApi, `/_${string}` | `/api/_${string}`> | Exclude<FetchRequest, string> | (string & {});
type MiddlewareOf<Route extends string, Method extends RouterMethod | "default"> = Method extends keyof InternalApi[MatchedRoutes<Route>] ? InternalApi[MatchedRoutes<Route>][Method] : never;
type TypedInternalResponse<Route, Default = unknown, Method extends RouterMethod = RouterMethod> = Default extends string | boolean | number | null | void | object ? Default : Route extends string ? MiddlewareOf<Route, Method> extends never ? MiddlewareOf<Route, "default"> extends never ? Default : MiddlewareOf<Route, "default"> : MiddlewareOf<Route, Method> : Default;
type AvailableRouterMethod<R extends NitroFetchRequest> = R extends string ? keyof InternalApi[MatchedRoutes<R>] extends undefined ? RouterMethod : Extract<keyof InternalApi[MatchedRoutes<R>], "default"> extends undefined ? Extract<RouterMethod, keyof InternalApi[MatchedRoutes<R>]> : RouterMethod : RouterMethod;
interface NitroFetchOptions<R extends NitroFetchRequest, M extends AvailableRouterMethod<R> = AvailableRouterMethod<R>> extends FetchOptions {
    method?: Uppercase<M> | M;
}
type ExtractedRouteMethod<R extends NitroFetchRequest, O extends NitroFetchOptions<R>> = O extends undefined ? "get" : Lowercase<O["method"]> extends RouterMethod ? Lowercase<O["method"]> : "get";
interface $Fetch<DefaultT = unknown, DefaultR extends NitroFetchRequest = NitroFetchRequest> {
    <T = DefaultT, R extends NitroFetchRequest = DefaultR, O extends NitroFetchOptions<R> = NitroFetchOptions<R>>(request: R, opts?: O): Promise<TypedInternalResponse<R, T, ExtractedRouteMethod<R, O>>>;
    raw<T = DefaultT, R extends NitroFetchRequest = DefaultR, O extends NitroFetchOptions<R> = NitroFetchOptions<R>>(request: R, opts?: O): Promise<FetchResponse<TypedInternalResponse<R, T, ExtractedRouteMethod<R, O>>>>;
    create<T = DefaultT, R extends NitroFetchRequest = DefaultR>(defaults: FetchOptions): $Fetch<T, R>;
}
declare global {
    var $fetch: $Fetch;
    namespace NodeJS {
        interface Global {
            $fetch: $Fetch;
        }
    }
}

interface NodeExternalsOptions {
    inline?: Array<string | RegExp | ((id: string, importer?: string) => Promise<boolean> | boolean)>;
    external?: Array<string | RegExp | ((id: string, importer?: string) => Promise<boolean> | boolean)>;
    rootDir?: string;
    outDir?: string;
    trace?: boolean;
    traceOptions?: NodeFileTraceOptions;
    moduleDirectories?: string[];
    exportConditions?: string[];
    traceInclude?: string[];
    traceAlias?: Record<string, string>;
}

type RollupConfig = InputOptions & {
    output: OutputOptions;
};

interface Options extends TransformOptions {
    include?: FilterPattern;
    exclude?: FilterPattern;
    sourceMap?: boolean | "inline" | "hidden";
    /**
     * Map extension to esbuild loader
     * Note that each entry (the extension) needs to start with a dot
     */
    loaders?: {
        [ext: string]: Loader | false;
    };
}

interface CacheEntry<T = any> {
    value?: T;
    expires?: number;
    mtime?: number;
    integrity?: string;
}
interface CacheOptions<T = any> {
    name?: string;
    getKey?: (...args: any[]) => string | Promise<string>;
    transform?: (entry: CacheEntry<T>, ...args: any[]) => any;
    validate?: (entry: CacheEntry<T>) => boolean;
    shouldInvalidateCache?: (...args: any[]) => boolean | Promise<boolean>;
    shouldBypassCache?: (...args: any[]) => boolean | Promise<boolean>;
    group?: string;
    integrity?: any;
    /**
     * Number of seconds to cache the response. Defaults to 1.
     */
    maxAge?: number;
    swr?: boolean;
    staleMaxAge?: number;
    base?: string;
}
interface ResponseCacheEntry<T = any> {
    body: T;
    code: number;
    headers: Record<string, string | number | string[]>;
}
interface CachedEventHandlerOptions<T = any> extends Omit<CacheOptions<ResponseCacheEntry<T>>, "transform" | "validate"> {
    shouldInvalidateCache?: (event: H3Event) => boolean | Promise<boolean>;
    shouldBypassCache?: (event: H3Event) => boolean | Promise<boolean>;
    getKey?: (event: H3Event) => string | Promise<string>;
    headersOnly?: boolean;
    varies?: string[];
}

type CapturedErrorContext = {
    event?: H3Event;
    [key: string]: unknown;
};
type CaptureError = (error: Error, context: CapturedErrorContext) => void;

const version = "2.9.6";

function hl(str) {
  return chalk.cyan(str);
}
function prettyPath(p, highlight = true) {
  p = relative(process.cwd(), p);
  return highlight ? hl(p) : p;
}
async function writeFile$1(file, contents, log = false) {
  await fsp.mkdir(dirname(file), { recursive: true });
  await fsp.writeFile(
    file,
    contents,
    typeof contents === "string" ? "utf8" : void 0
  );
  if (log) {
    consola.info("Generated", prettyPath(file));
  }
}
createRequire(import.meta.url);

let distDir = dirname(fileURLToPath(import.meta.url));
if (/(chunks|shared)$/.test(distDir)) {
  distDir = dirname(distDir);
}
resolve(distDir, "..");
const runtimeDir = resolve(distDir, "runtime");

const TIMING = "globalThis.__timing__";
const iife = (code) => `(function() { ${code.trim()} })();`.replace(/\n/g, "");
iife(`
const start = () => Date.now();
const end = s => Date.now() - s;
const _s = {};
const metrics = [];
const logStart = id => { _s[id] = Date.now(); };
const logEnd = id => { const t = end(_s[id]); delete _s[id]; metrics.push([id, t]); if (t > 0) { console.debug('>', id + ' (' + t + 'ms)'); } };
${TIMING} = { start, end, metrics, logStart, logEnd };
`);

function defineNitroPreset(preset) {
  return preset;
}

defineNitroPreset({
  entry: `#internal/nitro/entries/firebase-gen-{{ firebase.gen }}`,
  commands: {
    deploy: "npx firebase-tools deploy"
  },
  firebase: {
    // we need this defined here so it's picked up by the template in firebase's entry
    gen: Number.parseInt(process.env.NITRO_FIREBASE_GEN) || "default"
  },
  hooks: {
    async compiled(nitro) {
      await writeFirebaseConfig(nitro);
      await updatePackageJSON(nitro);
    },
    "rollup:before": (nitro, rollupConfig) => {
      const _gen = nitro.options.firebase?.gen;
      if (!_gen || _gen === "default") {
        nitro.logger.warn(
          "Neither `firebase.gen` or `NITRO_FIREBASE_GEN` is set. Nitro will default to Cloud Functions 1st generation. It is recommended to set this to the latest generation (currently `2`). Set the version to remove this warning. See https://nitro.unjs.io/deploy/providers/firebase for more information."
        );
        nitro.options.firebase = { gen: 1 };
      }
      nitro.options.appConfig.nitro = nitro.options.appConfig.nitro || {};
      nitro.options.appConfig.nitro.firebase = nitro.options.firebase;
      rollupConfig.plugins.unshift({
        name: "nitro:firebase",
        transform: (code, id) => {
          if (basename(id).startsWith("firebase-gen-")) {
            return {
              code: code.replace(
                /__firebaseServerFunctionName__/g,
                nitro.options.firebase?.serverFunctionName || "server"
              ),
              map: null
            };
          }
        }
      });
    }
  }
});
async function writeFirebaseConfig(nitro) {
  const firebaseConfigPath = join(nitro.options.rootDir, "firebase.json");
  if (existsSync(firebaseConfigPath)) {
    return;
  }
  const firebaseConfig = {
    functions: {
      source: relative(nitro.options.rootDir, nitro.options.output.serverDir)
    },
    hosting: [
      {
        site: "<your_project_id>",
        public: relative(nitro.options.rootDir, nitro.options.output.publicDir),
        cleanUrls: true,
        rewrites: [
          {
            source: "**",
            function: "server"
          }
        ]
      }
    ]
  };
  await writeFile$1(firebaseConfigPath, JSON.stringify(firebaseConfig, null, 2));
}
async function updatePackageJSON(nitro) {
  const packageJSONPath = join(nitro.options.output.serverDir, "package.json");
  const packageJSON = await readPackageJSON(packageJSONPath);
  await writePackageJSON(packageJSONPath, {
    ...packageJSON,
    main: "index.mjs",
    dependencies: Object.fromEntries(
      Object.entries({
        // Default to "latest" normally they should be overriden with user versions
        "firebase-admin": "latest",
        "firebase-functions": "latest",
        ...packageJSON.dependencies
      }).filter((e) => e[0] !== "fsevents").sort(([a], [b]) => a.localeCompare(b))
    ),
    engines: {
      // https://cloud.google.com/functions/docs/concepts/nodejs-runtime
      // const supportedNodeVersions = new Set(["20", "18", "16"]);
      node: nitro.options.firebase?.nodeVersion || "18"
    }
  });
}

const nitroImports = [
  {
    from: "#internal/nitro",
    imports: [
      "defineCachedFunction",
      "defineCachedEventHandler",
      "cachedFunction",
      "cachedEventHandler",
      "useRuntimeConfig",
      "useStorage",
      "useNitroApp",
      "defineNitroPlugin",
      "nitroPlugin",
      "defineRenderHandler",
      "getRouteRules",
      "useAppConfig",
      "useEvent",
      "defineTask",
      "runTask",
      "defineNitroErrorHandler"
    ]
  }
];

({
  // General
  debug: isDebug,
  timing: isDebug,
  logLevel: isTest ? 1 : 3,
  runtimeConfig: { app: {}, nitro: {} },
  appConfig: {},
  appConfigFiles: [],
  // Dirs
  scanDirs: [],
  buildDir: ".nitro",
  output: {
    dir: "{{ rootDir }}/.output",
    serverDir: "{{ output.dir }}/server",
    publicDir: "{{ output.dir }}/public"
  },
  // Features
  experimental: {},
  future: {},
  storage: {},
  devStorage: {},
  bundledStorage: [],
  publicAssets: [],
  serverAssets: [],
  plugins: [],
  tasks: {},
  scheduledTasks: {},
  imports: {
    exclude: [],
    dirs: [],
    presets: nitroImports,
    virtualImports: ["#imports"]
  },
  virtual: {},
  compressPublicAssets: false,
  ignore: [],
  // Dev
  dev: false,
  devServer: { watch: [] },
  watchOptions: { ignoreInitial: true },
  devProxy: {},
  // Logging
  logging: {
    compressedSizes: true,
    buildSuccess: true
  },
  // Routing
  baseURL: process.env.NITRO_APP_BASE_URL || "/",
  handlers: [],
  devHandlers: [],
  errorHandler: "#internal/nitro/error",
  routeRules: {},
  prerender: {
    autoSubfolderIndex: true,
    concurrency: 1,
    interval: 0,
    retry: 3,
    retryDelay: 500,
    failOnError: false,
    crawlLinks: false,
    ignore: [],
    routes: []
  },
  // Rollup
  alias: {
    "#internal/nitro": runtimeDir
  },
  unenv: {},
  analyze: false,
  moduleSideEffects: [
    "unenv/runtime/polyfill/",
    "node-fetch-native/polyfill",
    "node-fetch-native/dist/polyfill",
    resolve(runtimeDir, "polyfill/")
  ],
  replace: {},
  node: true,
  sourceMap: true,
  esbuild: {
    options: {
      jsxFactory: "h",
      jsxFragment: "Fragment"
    }
  },
  // Advanced
  typescript: {
    strict: false,
    generateTsConfig: true,
    tsconfigPath: "types/tsconfig.json",
    internalPaths: false,
    tsConfig: {}
  },
  nodeModulesDirs: [],
  hooks: {},
  commands: {},
  // Framework
  framework: {
    name: "nitro",
    version
  }
});

declare const alwaysdata: undefined;

declare const awsAmplify: NitroPreset;

declare const awsLambda: undefined;

declare const azureFunctions: NitroPreset;

declare const azure: NitroPreset;

declare const baseWorker: undefined;

declare const bun: undefined;

declare const cloudflareModule: NitroPreset;

declare const cloudflarePages: NitroPreset;
declare const cloudflarePagesStatic: NitroPreset;

declare const cloudflare: NitroPreset;

declare const denoDeploy: undefined;
declare const deno: undefined;

declare const denoServer: undefined;

declare const digitalOcean: undefined;

declare const firebase: NitroPreset;

declare const heroku: undefined;

declare const edgio: undefined;

declare const netlify: NitroPreset;
declare const netlifyBuilder: NitroPreset;
declare const netlifyEdge: NitroPreset;
declare const netlifyStatic: NitroPreset;

declare const nitroDev: undefined;

declare const nitroPrerender: undefined;

declare const cli: undefined;

declare const nodeServer: undefined;
declare const nodeCluster: undefined;

declare const node: undefined;

declare const platformSh: undefined;

declare const renderCom: undefined;

declare const serviceWorker: NitroPreset;

declare const stormkit: undefined;

declare const vercel: NitroPreset;
declare const vercelEdge: NitroPreset;
declare const vercelStatic: NitroPreset;

declare const cleavr: undefined;

declare const flightControl: undefined;

declare const koyeb: undefined;

declare const iisHandler: NitroPreset;
declare const iis: NitroPreset;
declare const iisNode: NitroPreset;

declare const _static: undefined;

declare const githubPages: undefined;

declare const winterjs: undefined;

declare const zeabur: NitroPreset;
declare const zeaburStatic: NitroPreset;

declare const _PRESETS_alwaysdata: typeof alwaysdata;
declare const _PRESETS_awsAmplify: typeof awsAmplify;
declare const _PRESETS_awsLambda: typeof awsLambda;
declare const _PRESETS_azure: typeof azure;
declare const _PRESETS_azureFunctions: typeof azureFunctions;
declare const _PRESETS_baseWorker: typeof baseWorker;
declare const _PRESETS_bun: typeof bun;
declare const _PRESETS_cleavr: typeof cleavr;
declare const _PRESETS_cli: typeof cli;
declare const _PRESETS_cloudflare: typeof cloudflare;
declare const _PRESETS_cloudflareModule: typeof cloudflareModule;
declare const _PRESETS_cloudflarePages: typeof cloudflarePages;
declare const _PRESETS_cloudflarePagesStatic: typeof cloudflarePagesStatic;
declare const _PRESETS_deno: typeof deno;
declare const _PRESETS_denoDeploy: typeof denoDeploy;
declare const _PRESETS_denoServer: typeof denoServer;
declare const _PRESETS_digitalOcean: typeof digitalOcean;
declare const _PRESETS_edgio: typeof edgio;
declare const _PRESETS_firebase: typeof firebase;
declare const _PRESETS_flightControl: typeof flightControl;
declare const _PRESETS_githubPages: typeof githubPages;
declare const _PRESETS_heroku: typeof heroku;
declare const _PRESETS_iis: typeof iis;
declare const _PRESETS_iisHandler: typeof iisHandler;
declare const _PRESETS_iisNode: typeof iisNode;
declare const _PRESETS_koyeb: typeof koyeb;
declare const _PRESETS_netlify: typeof netlify;
declare const _PRESETS_netlifyBuilder: typeof netlifyBuilder;
declare const _PRESETS_netlifyEdge: typeof netlifyEdge;
declare const _PRESETS_netlifyStatic: typeof netlifyStatic;
declare const _PRESETS_nitroDev: typeof nitroDev;
declare const _PRESETS_nitroPrerender: typeof nitroPrerender;
declare const _PRESETS_node: typeof node;
declare const _PRESETS_nodeCluster: typeof nodeCluster;
declare const _PRESETS_nodeServer: typeof nodeServer;
declare const _PRESETS_platformSh: typeof platformSh;
declare const _PRESETS_renderCom: typeof renderCom;
declare const _PRESETS_serviceWorker: typeof serviceWorker;
declare const _PRESETS_stormkit: typeof stormkit;
declare const _PRESETS_vercel: typeof vercel;
declare const _PRESETS_vercelEdge: typeof vercelEdge;
declare const _PRESETS_vercelStatic: typeof vercelStatic;
declare const _PRESETS_winterjs: typeof winterjs;
declare const _PRESETS_zeabur: typeof zeabur;
declare const _PRESETS_zeaburStatic: typeof zeaburStatic;
declare namespace _PRESETS {
  export { _PRESETS_alwaysdata as alwaysdata, _PRESETS_awsAmplify as awsAmplify, _PRESETS_awsLambda as awsLambda, _PRESETS_azure as azure, _PRESETS_azureFunctions as azureFunctions, _PRESETS_baseWorker as baseWorker, _PRESETS_bun as bun, _PRESETS_cleavr as cleavr, _PRESETS_cli as cli, _PRESETS_cloudflare as cloudflare, _PRESETS_cloudflareModule as cloudflareModule, _PRESETS_cloudflarePages as cloudflarePages, _PRESETS_cloudflarePagesStatic as cloudflarePagesStatic, _PRESETS_deno as deno, _PRESETS_denoDeploy as denoDeploy, _PRESETS_denoServer as denoServer, _PRESETS_digitalOcean as digitalOcean, _PRESETS_edgio as edgio, _PRESETS_firebase as firebase, _PRESETS_flightControl as flightControl, _PRESETS_githubPages as githubPages, _PRESETS_heroku as heroku, _PRESETS_iis as iis, _PRESETS_iisHandler as iisHandler, _PRESETS_iisNode as iisNode, _PRESETS_koyeb as koyeb, edgio as layer0, _PRESETS_netlify as netlify, _PRESETS_netlifyBuilder as netlifyBuilder, _PRESETS_netlifyEdge as netlifyEdge, _PRESETS_netlifyStatic as netlifyStatic, _PRESETS_nitroDev as nitroDev, _PRESETS_nitroPrerender as nitroPrerender, _PRESETS_node as node, _PRESETS_nodeCluster as nodeCluster, _PRESETS_nodeServer as nodeServer, _PRESETS_platformSh as platformSh, _PRESETS_renderCom as renderCom, _PRESETS_serviceWorker as serviceWorker, _static as static, _PRESETS_stormkit as stormkit, _PRESETS_vercel as vercel, _PRESETS_vercelEdge as vercelEdge, _PRESETS_vercelStatic as vercelStatic, _PRESETS_winterjs as winterjs, _PRESETS_zeabur as zeabur, _PRESETS_zeaburStatic as zeaburStatic };
}

interface NitroEventHandler {
    /**
     * Path prefix or route
     *
     * If an empty string used, will be used as a middleware
     */
    route?: string;
    /**
     * Specifies this is a middleware handler.
     * Middleware are called on every route and should normally return nothing to pass to the next handlers
     */
    middleware?: boolean;
    /**
     * Use lazy loading to import handler
     */
    lazy?: boolean;
    /**
     * Path to event handler
     *
     */
    handler: string;
    /**
     * Router method matcher
     */
    method?: string;
}
interface NitroDevEventHandler {
    /**
     * Path prefix or route
     */
    route?: string;
    /**
     * Event handler
     *
     */
    handler: EventHandler;
}
type NitroErrorHandler = (error: H3Error, event: H3Event) => void | Promise<void>;

type AmplifyImageSettings = {
    /** Array of supported image widths */
    sizes: number[];
    /**
     * Array of allowed external domains that can use Image Optimization.
     * Leave empty for only allowing the deployment domain to use Image Optimization.
     */
    domains: string[];
    /**
     * Array of allowed external patterns that can use Image Optimization.
     * Similar to `domains` but provides more control with RegExp.
     */
    remotePatterns: {
        /** The protocol of the allowed remote pattern. Can be `http` or `https`. */
        protocol?: "http" | "https";
        /**
         * The hostname of the allowed remote pattern.
         * Can be literal or wildcard. Single `*` matches a single subdomain.
         *  Double `**` matches any number of subdomains.
         * We will disallow blanket wildcards of `**` with nothing else.
         */
        hostname: string;
        /** The port of the allowed remote pattern. */
        port?: string;
        /** The pathname of the allowed remote pattern. */
        pathname?: string;
    }[];
    /** Array of allowed output image formats. */
    formats: ("image/avif" | "image/webp" | "image/gif" | "image/png" | "image/jpeg")[];
    /** Cache duration (in seconds) for the optimized images. */
    minimumCacheTTL: number;
    /** Allow SVG input image URLs. This is disabled by default for security purposes. */
    dangerouslyAllowSVG: boolean;
};
interface AWSAmplifyOptions {
    catchAllStaticFallback?: boolean;
    imageOptimization?: {
        path?: string;
        cacheControl?: string;
    };
    imageSettings?: AmplifyImageSettings;
}

interface AzureOptions {
    config?: {
        platform?: {
            apiRuntime?: string;
            [key: string]: unknown;
        };
        navigationFallback?: {
            rewrite?: string;
            [key: string]: unknown;
        };
        [key: string]: unknown;
    };
}

/**
 * https://developers.cloudflare.com/pages/platform/functions/routing/#functions-invocation-routes
 */
interface CloudflarePagesRoutes {
    /** Defines the version of the schema. Currently there is only one version of the schema (version 1), however, we may add more in the future and aim to be backwards compatible. */
    version?: 1;
    /** Defines routes that will be invoked by Functions. Accepts wildcard behavior. */
    include?: string[];
    /** Defines routes that will not be invoked by Functions. Accepts wildcard behavior. `exclude` always take priority over `include`. */
    exclude?: string[];
}
interface CloudflareOptions {
    pages: {
        /**
         * Nitro will automatically generate a `_routes.json` that controls which files get served statically and
         * which get served by the Worker. Using this config will override the automatic `_routes.json`. Or, if the
         * `merge` options is set, it will merge the user-set routes with the auto-generated ones, giving priority
         * to the user routes.
         *
         * @see https://developers.cloudflare.com/pages/platform/functions/routing/#functions-invocation-routes
         *
         * There are a maximum of 100 rules, and you must have at least one include rule. Wildcards are accepted.
         *
         * If any fields are unset, they default to:
         *
         * ```json
         * {
         *   "version": 1,
         *   "include": ["/*"],
         *   "exclude": []
         * }
         * ```
         */
        routes?: CloudflarePagesRoutes;
        /**
         * If set to `false`, nitro will disable the automatically generated `_routes.json` and instead use the user-set only ones.
         *
         * @default true
         */
        defaultRoutes?: boolean;
    };
}

type FirebaseOptions = FirebaseOptionsGen1 | FirebaseOptionsGen2;
interface FirebaseOptionsBase {
    gen: 1 | 2;
    /**
     * Firebase functions node runtime version.
     * @see https://cloud.google.com/functions/docs/concepts/nodejs-runtime
     */
    nodeVersion?: "20" | "18" | "16";
    /**
     * When deploying multiple apps within the same Firebase project
     * you must give your server a unique name in order to avoid overwriting your functions.
     *
     * @default "server"
     */
    serverFunctionName?: string;
}
interface FirebaseOptionsGen1 extends FirebaseOptionsBase {
    gen: 1;
    /**
     * Firebase functions 1st generation region passed to `functions.region()`.
     */
    region?: Parameters<typeof region>[0];
    /**
     * Firebase functions 1st generation runtime options passed to `functions.runWith()`.
     */
    runtimeOptions?: RuntimeOptions;
}
interface FirebaseOptionsGen2 extends FirebaseOptionsBase {
    gen: 2;
    /**
     * Firebase functions 2nd generation https options passed to `onRequest`.
     * @see https://firebase.google.com/docs/reference/functions/2nd-gen/node/firebase-functions.https.httpsoptions
     */
    httpsOptions?: HttpsOptions;
}

/**
 * Netlify options
 */
interface NetlifyOptions {
    images?: {
        /**
         * Permitted remote image sources. Array of regex strings.
         * @see https://docs.netlify.com/image-cdn/overview/#remote-path
         */
        remote_images?: string[];
    };
}

/**
 * Vercel Build Output Configuration
 * @see https://vercel.com/docs/build-output-api/v3
 */
interface VercelBuildConfigV3 {
    version: 3;
    routes?: ({
        src: string;
        headers: {
            "cache-control": string;
        };
        continue: boolean;
    } | {
        handle: string;
    } | {
        src: string;
        dest: string;
    })[];
    images?: {
        sizes: number[];
        domains: string[];
        remotePatterns?: {
            protocol?: "http" | "https";
            hostname: string;
            port?: string;
            pathname?: string;
        }[];
        minimumCacheTTL?: number;
        formats?: ("image/avif" | "image/webp")[];
        dangerouslyAllowSVG?: boolean;
        contentSecurityPolicy?: string;
    };
    wildcard?: Array<{
        domain: string;
        value: string;
    }>;
    overrides?: Record<string, {
        path?: string;
        contentType?: string;
    }>;
    cache?: string[];
    bypassToken?: string;
    crons?: {
        path: string;
        schedule: string;
    }[];
}
/**
 * https://vercel.com/docs/build-output-api/v3/primitives#serverless-function-configuration
 */
interface VercelServerlessFunctionConfig {
    /**
     * Amount of memory (RAM in MB) that will be allocated to the Serverless Function.
     */
    memory?: number;
    /**
     * Maximum execution duration (in seconds) that will be allowed for the Serverless Function.
     */
    maxDuration?: number;
    /**
     * True if a custom runtime has support for Lambda runtime wrappers.
     */
    supportsWrapper?: boolean;
    /**
     * When true, the Serverless Function will stream the response to the client.
     */
    supportsResponseStreaming?: boolean;
    [key: string]: unknown;
}
interface VercelOptions {
    config: VercelBuildConfigV3;
    /**
     * If you are using `vercel-edge`, you can specify the region(s) for your edge function.
     * @see https://vercel.com/docs/concepts/functions/edge-functions#edge-function-regions
     */
    regions?: string[];
    functions?: VercelServerlessFunctionConfig;
}

interface PresetOptions {
    awsAmplify: AWSAmplifyOptions;
    azure: AzureOptions;
    cloudflare: CloudflareOptions;
    firebase: FirebaseOptions;
    netlify: NetlifyOptions;
    vercel: VercelOptions;
}

type NitroModuleInput = string | NitroModule | NitroModule["setup"];
interface NitroModule {
    name?: string;
    setup: (this: void, nitro: Nitro) => void | Promise<void>;
}

type NitroDynamicConfig = Pick<NitroConfig, "runtimeConfig" | "routeRules">;
interface NitroRuntimeConfigApp {
    baseURL: string;
    [key: string]: any;
}
interface NitroRuntimeConfig {
    app: NitroRuntimeConfigApp;
    nitro: {
        envPrefix?: string;
        envExpansion?: boolean;
        routeRules?: {
            [path: string]: NitroRouteConfig;
        };
    };
    [key: string]: any;
}
interface Nitro {
    options: NitroOptions;
    scannedHandlers: NitroEventHandler[];
    vfs: Record<string, string>;
    hooks: Hookable<NitroHooks>;
    unimport?: Unimport;
    logger: ConsolaInstance;
    storage: Storage;
    close: () => Promise<void>;
    updateConfig: (config: NitroDynamicConfig) => void | Promise<void>;
    _prerenderedRoutes?: PrerenderRoute[];
    _prerenderMeta?: Record<string, {
        contentType?: string;
    }>;
}
interface PrerenderRoute {
    route: string;
    contents?: string;
    data?: ArrayBuffer;
    fileName?: string;
    error?: Error & {
        statusCode: number;
        statusMessage: string;
    };
    generateTimeMS?: number;
    skip?: boolean;
    contentType?: string;
}
/** @deprecated Internal type will be removed in future versions */
type PrerenderGenerateRoute = PrerenderRoute;
type HookResult = void | Promise<void>;
type NitroTypes = {
    routes: Record<string, Partial<Record<RouterMethod | "default", string[]>>>;
};
interface NitroHooks {
    "types:extend": (types: NitroTypes) => HookResult;
    "rollup:before": (nitro: Nitro, config: RollupConfig) => HookResult;
    compiled: (nitro: Nitro) => HookResult;
    "dev:reload": () => HookResult;
    "rollup:reload": () => HookResult;
    restart: () => HookResult;
    close: () => HookResult;
    "prerender:routes": (routes: Set<string>) => HookResult;
    "prerender:config": (config: NitroConfig) => HookResult;
    "prerender:init": (prerenderer: Nitro) => HookResult;
    "prerender:generate": (route: PrerenderRoute, nitro: Nitro) => HookResult;
    "prerender:route": (route: PrerenderRoute) => HookResult;
    "prerender:done": (result: {
        prerenderedRoutes: PrerenderRoute[];
        failedRoutes: PrerenderRoute[];
    }) => HookResult;
}
type CustomDriverName = string & {
    _custom?: any;
};
interface StorageMounts {
    [path: string]: {
        driver: BuiltinDriverName | CustomDriverName;
        [option: string]: any;
    };
}
type DatabaseConnectionName = "default" | (string & {});
type DatabaseConnectionConfig = {
    connector: ConnectorName;
    options?: {
        [key: string]: any;
    };
};
type DatabaseConnectionConfigs = Record<DatabaseConnectionName, DatabaseConnectionConfig>;
type DeepPartial<T> = T extends Record<string, any> ? {
    [P in keyof T]?: DeepPartial<T[P]> | T[P];
} : T;
type NitroPreset = NitroConfig | (() => NitroConfig);
interface NitroConfig extends DeepPartial<Omit<NitroOptions, "routeRules" | "rollupConfig">>, C12InputConfig<NitroConfig> {
    extends?: string | string[] | NitroPreset;
    routeRules?: {
        [path: string]: NitroRouteConfig;
    };
    rollupConfig?: Partial<RollupConfig>;
}
interface AppConfig {
    [key: string]: any;
}
interface PublicAssetDir {
    baseURL?: string;
    fallthrough?: boolean;
    maxAge: number;
    dir: string;
}
interface ServerAssetDir {
    baseName: string;
    dir: string;
}
interface DevServerOptions {
    watch: string[];
}
interface CompressOptions {
    gzip?: boolean;
    brotli?: boolean;
}
type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;
type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
type HTTPStatusCode = IntRange<100, 600>;
type ExcludeFunctions<G extends Record<string, any>> = Pick<G, {
    [P in keyof G]: NonNullable<G[P]> extends Function ? never : P;
}[keyof G]>;
interface NitroRouteConfig {
    cache?: ExcludeFunctions<CachedEventHandlerOptions> | false;
    headers?: Record<string, string>;
    redirect?: string | {
        to: string;
        statusCode?: HTTPStatusCode;
    };
    prerender?: boolean;
    proxy?: string | ({
        to: string;
    } & ProxyOptions);
    isr?: number | boolean;
    cors?: boolean;
    swr?: boolean | number;
    static?: boolean | number;
}
interface NitroRouteRules extends Omit<NitroRouteConfig, "redirect" | "cors" | "swr" | "static"> {
    redirect?: {
        to: string;
        statusCode: HTTPStatusCode;
    };
    proxy?: {
        to: string;
    } & ProxyOptions;
}
interface NitroFrameworkInfo {
    name?: "nitro" | (string & {});
    version?: string;
}
/** Build info written to `.output/nitro.json` or `.nitro/dev/nitro.json` */
interface NitroBuildInfo {
    date: string;
    preset: string;
    framework: NitroFrameworkInfo;
    versions: {
        nitro: string;
        [key: string]: string;
    };
    commands?: {
        preview?: string;
        deploy?: string;
    };
    dev?: {
        pid: number;
        workerAddress: {
            host: string;
            port: number;
            socketPath?: string;
        };
    };
}
interface NitroOptions extends PresetOptions {
    _config: NitroConfig;
    _c12: ResolvedConfig<NitroConfig> | ConfigWatcher<NitroConfig>;
    debug: boolean;
    preset: KebabCase<keyof typeof _PRESETS> | (string & {});
    static: boolean;
    logLevel: LogLevel;
    runtimeConfig: NitroRuntimeConfig;
    appConfig: AppConfig;
    appConfigFiles: string[];
    workspaceDir: string;
    rootDir: string;
    srcDir: string;
    scanDirs: string[];
    buildDir: string;
    output: {
        dir: string;
        serverDir: string;
        publicDir: string;
    };
    storage: StorageMounts;
    devStorage: StorageMounts;
    database: DatabaseConnectionConfigs;
    devDatabase: DatabaseConnectionConfigs;
    bundledStorage: string[];
    timing: boolean;
    renderer?: string;
    serveStatic: boolean | "node" | "deno" | "inline";
    noPublicDir: boolean;
    /**
     * @experimental Requires `experimental.wasm` to work
     *
     * @see https://github.com/unjs/unwasm
     */
    wasm?: UnwasmPluginOptions;
    experimental?: {
        legacyExternals?: boolean;
        openAPI?: boolean;
        /**
         * See https://github.com/microsoft/TypeScript/pull/51669
         */
        typescriptBundlerResolution?: boolean;
        /**
         * Enable native async context support for useEvent()
         */
        asyncContext?: boolean;
        /**
         * Enable Experimental WebAssembly Support
         *
         * @see https://github.com/unjs/unwasm
         */
        wasm?: boolean;
        /**
         * Disable Experimental bundling of Nitro Runtime Dependencies
         */
        bundleRuntimeDependencies?: false;
        /**
         * Disable Experimental Sourcemap Minification
         */
        sourcemapMinify?: false;
        /**
         * Backward compatibility support for Node fetch (required for Node < 18)
         */
        nodeFetchCompat?: boolean;
        /**
         * Allow env expansion in runtime config
         *
         * @see https://github.com/unjs/nitro/pull/2043
         */
        envExpansion?: boolean;
        /**
         * Enable experimental WebSocket support
         *
         * @see https://nitro.unjs.io/guide/websocket
         */
        websocket?: boolean;
        /**
         * Enable experimental Database support
         *
         * @see https://nitro.unjs.io/guide/database
         */
        database?: boolean;
        /**
         * Enable experimental Tasks support
         *
         * @see https://nitro.unjs.io/guide/tasks
         */
        tasks?: boolean;
    };
    future: {
        nativeSWR: boolean;
    };
    serverAssets: ServerAssetDir[];
    publicAssets: PublicAssetDir[];
    imports: UnimportPluginOptions | false;
    modules?: NitroModuleInput[];
    plugins: string[];
    tasks: {
        [name: string]: {
            handler: string;
            description: string;
        };
    };
    scheduledTasks: {
        [cron: string]: string | string[];
    };
    virtual: Record<string, string | (() => string | Promise<string>)>;
    compressPublicAssets: boolean | CompressOptions;
    ignore: string[];
    dev: boolean;
    devServer: DevServerOptions;
    watchOptions: WatchOptions;
    devProxy: Record<string, string | ProxyServerOptions>;
    logging: {
        compressedSizes: boolean;
        buildSuccess: boolean;
    };
    baseURL: string;
    handlers: NitroEventHandler[];
    routeRules: {
        [path: string]: NitroRouteRules;
    };
    devHandlers: NitroDevEventHandler[];
    errorHandler: string;
    devErrorHandler: NitroErrorHandler;
    prerender: {
        /**
         * Prerender HTML routes within subfolders (`/test` would produce `/test/index.html`)
         */
        autoSubfolderIndex: boolean;
        concurrency: number;
        interval: number;
        crawlLinks: boolean;
        failOnError: boolean;
        ignore: Array<string | RegExp | ((path: string) => undefined | null | boolean)>;
        routes: string[];
        /**
         * Amount of retries. Pass Infinity to retry indefinitely.
         * @default 3
         */
        retry: number;
        /**
         * Delay between each retry in ms.
         * @default 500
         */
        retryDelay: number;
    };
    rollupConfig?: RollupConfig;
    entry: string;
    unenv: Preset;
    alias: Record<string, string>;
    minify: boolean;
    inlineDynamicImports: boolean;
    sourceMap: boolean | "inline" | "hidden";
    node: boolean;
    moduleSideEffects: string[];
    esbuild?: {
        options?: Partial<Options>;
    };
    noExternals: boolean;
    externals: NodeExternalsOptions;
    analyze: false | PluginVisualizerOptions;
    replace: Record<string, string | ((id: string) => string)>;
    commonJS?: RollupCommonJSOptions;
    exportConditions?: string[];
    typescript: {
        strict?: boolean;
        internalPaths?: boolean;
        generateTsConfig?: boolean;
        /** the path of the generated `tsconfig.json`, relative to buildDir */
        tsconfigPath: string;
        tsConfig?: Partial<TSConfig>;
    };
    hooks: NestedHooks<NitroHooks>;
    nodeModulesDirs: string[];
    commands: {
        preview: string;
        deploy: string;
    };
    framework: NitroFrameworkInfo;
    iis?: {
        mergeConfig?: boolean;
        overrideConfig?: boolean;
    };
}
declare global {
    const defineNitroConfig: (config: NitroConfig) => NitroConfig;
    const defineNitroModule: (definition: NitroModule) => NitroModule;
}

interface NitroStaticBuildFlags {
    _asyncContext?: boolean;
    _websocket?: boolean;
    _tasks?: boolean;
    dev?: boolean;
    client?: boolean;
    nitro?: boolean;
    prerender?: boolean;
    preset?: NitroOptions["preset"];
    server?: boolean;
    versions?: {
        nitro?: string;
    };
}
declare global {
    namespace NodeJS {
        interface Process extends NitroStaticBuildFlags {
        }
    }
    interface ImportMeta extends NitroStaticBuildFlags {
    }
}

type H3EventFetch = (request: NitroFetchRequest, init?: RequestInit) => Promise<Response>;
type H3Event$Fetch = $Fetch<unknown, NitroFetchRequest>;
declare module "h3" {
    interface H3Event {
        /** @experimental Calls fetch with same context and request headers */
        fetch: H3EventFetch;
        /** @experimental Calls fetch with same context and request headers */
        $fetch: H3Event$Fetch;
        /** @experimental See https://github.com/unjs/nitro/issues/1420 */
        waitUntil: (promise: Promise<unknown>) => void;
        /** @experimental */
        captureError: CaptureError;
    }
    interface H3Context {
        nitro: {
            _waitUntilPromises?: Promise<unknown>[];
            /** @experimental */
            errors: {
                error?: Error;
                context: CapturedErrorContext;
            }[];
        };
    }
}

export type { $Fetch as $, AvailableRouterMethod as A, MatchedRoutes as B, CompressOptions as C, DatabaseConnectionName as D, ExtractedRouteMethod as E, NitroModuleInput as F, NitroModule as G, H3EventFetch as H, InternalApi as I, KebabCase as K, MiddlewareOf as M, NitroConfig as N, PrerenderRoute as P, StorageMounts as S, TypedInternalResponse as T, Nitro as a, NitroOptions as b, NitroPreset as c, NitroFetchRequest as d, NitroFetchOptions as e, NitroStaticBuildFlags as f, H3Event$Fetch as g, NitroDynamicConfig as h, NitroRuntimeConfigApp as i, NitroRuntimeConfig as j, PrerenderGenerateRoute as k, NitroTypes as l, NitroHooks as m, DatabaseConnectionConfig as n, DatabaseConnectionConfigs as o, AppConfig as p, PublicAssetDir as q, ServerAssetDir as r, DevServerOptions as s, NitroRouteConfig as t, NitroRouteRules as u, NitroFrameworkInfo as v, NitroBuildInfo as w, NitroEventHandler as x, NitroDevEventHandler as y, NitroErrorHandler as z };
