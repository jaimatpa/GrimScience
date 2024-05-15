import { d as defineCommand, c as consola } from '../shared/nuxi.9edf0930.mjs';
import 'node:util';
import 'node:path';
import 'node:process';
import 'node:tty';
import { l as loadKit, w as writeTypes } from '../shared/nuxi.dc1b30dc.mjs';
import { a as clearBuildDir } from '../shared/nuxi.1ff5d6e2.mjs';
import { s as sharedArgs, l as legacyRootDirArgs, r as resolve, a as relative } from '../shared/nuxi.610c92ff.mjs';
import 'node:url';
import '../shared/nuxi.1902c37d.mjs';
import 'node:module';
import 'node:fs';
import '../shared/nuxi.53f5921c.mjs';
import 'node:assert';
import 'node:v8';
import 'node:perf_hooks';
import '../shared/nuxi.eaa29140.mjs';
import './satisfies.mjs';
import '../shared/nuxi.2155838d.mjs';
import '../shared/nuxi.cc8dd4a9.mjs';
import '../shared/nuxi.73800aa7.mjs';
import 'crypto';
import 'fs';
import 'module';
import 'path';
import 'perf_hooks';
import 'os';
import 'vm';
import 'url';
import 'assert';
import 'process';
import 'v8';
import 'util';
import 'tty';

const prepare = defineCommand({
  meta: {
    name: "prepare",
    description: "Prepare Nuxt for development/build"
  },
  args: {
    ...sharedArgs,
    ...legacyRootDirArgs
  },
  async run(ctx) {
    process.env.NODE_ENV = process.env.NODE_ENV || "production";
    const cwd = resolve(ctx.args.cwd || ctx.args.rootDir || ".");
    const {
      loadNuxt,
      buildNuxt,
      writeTypes: writeTypes$1 = writeTypes
    } = await loadKit(cwd);
    const nuxt = await loadNuxt({
      cwd,
      overrides: {
        _prepare: true,
        logLevel: ctx.args.logLevel,
        ...ctx.data?.overrides
      }
    });
    await clearBuildDir(nuxt.options.buildDir);
    await buildNuxt(nuxt);
    await writeTypes$1(nuxt);
    consola.success(
      "Types generated in",
      relative(process.cwd(), nuxt.options.buildDir)
    );
  }
});

export { prepare as default };
