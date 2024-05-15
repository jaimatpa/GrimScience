import { defineCommand } from 'citty';
import { resolve } from 'pathe';
import { a as createNitro, p as prepare, c as copyPublicAssets, b as build$1 } from '../nitro.mjs';
import { p as prerender } from '../chunks/prerender.mjs';
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
import 'radix3';

const build = defineCommand({
  meta: {
    name: "build",
    description: "Build nitro project for production"
  },
  args: {
    ...commonArgs,
    minify: {
      type: "boolean",
      description: "Minify the output (overides preset defaults you can also use `--no-minify` to disable)."
    },
    preset: {
      type: "string",
      description: "The build preset to use (you can also use `NITRO_PRESET` environment variable)."
    }
  },
  async run({ args }) {
    const rootDir = resolve(args.dir || args._dir || ".");
    const nitro = await createNitro({
      rootDir,
      dev: false,
      minify: args.minify,
      preset: args.preset
    });
    await prepare(nitro);
    await copyPublicAssets(nitro);
    await prerender(nitro);
    await build$1(nitro);
    await nitro.close();
  }
});

export { build as default };
