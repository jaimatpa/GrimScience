import { defineCommand } from 'citty';
import { resolve } from 'pathe';
import { consola } from 'consola';
import { l as listTasks } from '../chunks/task.mjs';
import 'node:fs';
import 'node:fs/promises';
import 'ofetch';

const list = defineCommand({
  meta: {
    name: "run",
    description: "List available tasks (experimental)"
  },
  args: {
    dir: {
      type: "string",
      description: "project root directory"
    }
  },
  async run({ args }) {
    const cwd = resolve(args.dir || args.cwd || ".");
    const tasks = await listTasks({ cwd, buildDir: ".nitro" });
    for (const [name, task] of Object.entries(tasks)) {
      consola.log(
        ` - \`${name}\`${task.meta?.description ? ` - ${task.meta.description}` : ""}`
      );
    }
  }
});

export { list as default };
