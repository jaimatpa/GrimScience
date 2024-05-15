import { defineCommand } from 'citty';
import { resolve } from 'pathe';
import destr from 'destr';
import { consola } from 'consola';
import { r as runTask } from '../chunks/task.mjs';
import 'node:fs';
import 'node:fs/promises';
import 'ofetch';

const run = defineCommand({
  meta: {
    name: "run",
    description: "Run a runtime task in the currently running dev server (experimental)"
  },
  args: {
    name: {
      type: "positional",
      description: "task name",
      required: true
    },
    dir: {
      type: "string",
      description: "project root directory"
    },
    payload: {
      type: "string",
      description: "payload json to pass to the task"
    }
  },
  async run({ args }) {
    const cwd = resolve(args.dir || args.cwd || ".");
    consola.info(`Running task \`${args.name}\`...`);
    let payload = destr(args.payload || "{}");
    if (typeof payload !== "object") {
      consola.error(
        `Invalid payload: \`${args.payload}\` (it should be a valid JSON object)`
      );
      payload = void 0;
    }
    try {
      const { result } = await runTask(
        {
          name: args.name,
          context: {},
          payload
        },
        {
          cwd,
          buildDir: ".nitro"
        }
      );
      consola.success("Result:", result);
    } catch (err) {
      consola.error(`Failed to run task \`${args.name}\`: ${err.message}`);
      process.exit(1);
    }
  }
});

export { run as default };
