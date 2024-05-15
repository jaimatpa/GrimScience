import { execa } from './index3.mjs';
import { d as defineCommand } from '../shared/nuxi.9edf0930.mjs';
import { l as loadKit, w as writeTypes } from '../shared/nuxi.dc1b30dc.mjs';
import { t as tryResolveModule } from '../shared/nuxi.1902c37d.mjs';
import { s as sharedArgs, l as legacyRootDirArgs, r as resolve } from '../shared/nuxi.610c92ff.mjs';
import 'node:buffer';
import 'node:path';
import 'node:child_process';
import 'node:process';
import '../shared/nuxi.2155838d.mjs';
import 'child_process';
import 'path';
import 'fs';
import 'node:url';
import 'node:os';
import 'node:fs';
import 'node:timers/promises';
import 'stream';
import 'node:util';
import 'node:tty';
import 'node:perf_hooks';
import '../shared/nuxi.eaa29140.mjs';
import './satisfies.mjs';
import '../shared/nuxi.cc8dd4a9.mjs';
import '../shared/nuxi.73800aa7.mjs';
import 'crypto';
import 'module';
import 'perf_hooks';
import 'os';
import 'vm';
import 'url';
import 'assert';
import 'process';
import 'v8';
import 'util';
import 'tty';
import '../shared/nuxi.53f5921c.mjs';
import 'node:module';
import 'node:assert';
import 'node:v8';

const typecheck = defineCommand({
  meta: {
    name: "typecheck",
    description: "Runs `vue-tsc` to check types throughout your app."
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
        .../*ctx.options?.overrides || */
        {}
      }
    });
    await writeTypes$1(nuxt);
    await buildNuxt(nuxt);
    await nuxt.close();
    const [resolvedTypeScript, resolvedVueTsc] = await Promise.all([
      tryResolveModule("typescript"),
      tryResolveModule("vue-tsc/bin/vue-tsc.js")
    ]);
    if (resolvedTypeScript && resolvedVueTsc) {
      await execa(resolvedVueTsc, ["--noEmit"], {
        preferLocal: true,
        stdio: "inherit",
        cwd
      });
    } else {
      await execa(
        "npx",
        "-p vue-tsc -p typescript vue-tsc --noEmit".split(" "),
        { stdio: "inherit", cwd }
      );
    }
  }
});

export { typecheck as default };
