import { defineCommand } from 'citty';
import { resolve } from 'pathe';
import { a as createNitro, w as writeTypes } from '../nitro.mjs';
import { c as commonArgs } from './common.mjs';
import 'node:fs';
import 'pathe/utils';
import 'rollup';
import 'fs-extra';
import 'defu';
import 'chokidar';
import 'knitwork';
import 'perfect-debounce';
import 'globby';
import 'mlly';
import '../chunks/package.mjs';
import 'pretty-bytes';
import 'gzip-size';
import 'chalk';
import 'std-env';
import 'node:url';
import 'node:module';
import '@rollup/plugin-commonjs';
import '@rollup/plugin-alias';
import '@rollup/plugin-json';
import '@rollup/plugin-inject';
import '@rollup/plugin-node-resolve';
import 'rollup-plugin-visualizer';
import 'unenv';
import 'unimport/unplugin';
import 'ohash';
import 'unwasm/plugin';
import '@rollup/plugin-replace';
import 'node:os';
import 'pkg-types';
import '@vercel/nft';
import 'semver';
import 'consola';
import 'etag';
import 'mime';
import 'unstorage';
import 'esbuild';
import '@rollup/pluginutils';
import 'db0';
import 'scule';
import 'node:zlib';
import 'node:fs/promises';
import 'hookable';
import 'unimport';
import 'c12';
import 'klona/full';
import 'escape-string-regexp';
import 'ufo';
import 'jiti';
import 'dot-prop';
import 'node:path';
import 'archiver';
import 'magic-string';

const prepare = defineCommand({
  meta: {
    name: "prepare",
    description: "Generate types for the project"
  },
  args: {
    ...commonArgs
  },
  async run({ args }) {
    const rootDir = resolve(args.dir || args._dir || ".");
    const nitro = await createNitro({ rootDir });
    await writeTypes(nitro);
  }
});

export { prepare as default };
