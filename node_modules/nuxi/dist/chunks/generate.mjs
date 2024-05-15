import { d as defineCommand } from '../shared/nuxi.9edf0930.mjs';
import buildCommand from './build.mjs';
import { s as sharedArgs, l as legacyRootDirArgs } from '../shared/nuxi.610c92ff.mjs';
import 'node:util';
import 'node:path';
import 'node:process';
import 'node:tty';
import 'node:url';
import '../shared/nuxi.dc1b30dc.mjs';
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
import '../shared/nuxi.1ff5d6e2.mjs';
import '../shared/nuxi.2509f57e.mjs';
import '../shared/nuxi.c8477004.mjs';
import '../shared/nuxi.d3241ca4.mjs';
import '../shared/nuxi.5aaa4630.mjs';

const generate = defineCommand({
  meta: {
    name: "generate",
    description: "Build Nuxt and prerender all routes"
  },
  args: {
    ...sharedArgs,
    ...legacyRootDirArgs,
    dotenv: {
      type: "string",
      description: "Path to .env file"
    }
  },
  async run(ctx) {
    ctx.args.prerender = true;
    await buildCommand.run(ctx);
  }
});

export { generate as default };
