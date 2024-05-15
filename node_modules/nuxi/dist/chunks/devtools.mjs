import { execa } from './index3.mjs';
import { d as defineCommand } from '../shared/nuxi.9edf0930.mjs';
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

const devtools = defineCommand({
  meta: {
    name: "devtools",
    description: "Enable or disable devtools in a Nuxt project"
  },
  args: {
    ...sharedArgs,
    command: {
      type: "positional",
      description: "Command to run",
      valueHint: "enable|disable"
    },
    ...legacyRootDirArgs
  },
  async run(ctx) {
    const cwd = resolve(ctx.args.cwd || ctx.args.rootDir || ".");
    if (!["enable", "disable"].includes(ctx.args.command)) {
      console.error(`Unknown command \`${ctx.args.command}\`.`);
      process.exit(1);
    }
    await execa(
      "npx",
      ["@nuxt/devtools-wizard@latest", ctx.args.command, cwd],
      {
        stdio: "inherit",
        cwd
      }
    );
  }
});

export { devtools as default };
