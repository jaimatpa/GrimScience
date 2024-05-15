import { existsSync, promises } from 'node:fs';
import { d as defineCommand, c as consola } from '../shared/nuxi.9edf0930.mjs';
import 'node:util';
import 'node:path';
import 'node:process';
import 'node:tty';
import { l as loadKit } from '../shared/nuxi.dc1b30dc.mjs';
import { u as upperFirst } from '../shared/nuxi.349af404.mjs';
import { s as sharedArgs, r as resolve, e as extname, d as dirname } from '../shared/nuxi.610c92ff.mjs';
import 'node:url';
import '../shared/nuxi.1902c37d.mjs';
import 'node:module';
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

const httpMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
const api = ({ name, args }) => ({
  path: `server/api/${name}${applySuffix(args, httpMethods, "method")}.ts`,
  contents: `
export default defineEventHandler((event) => {
  return 'Hello ${name}'
})
`
});
const plugin = ({ name, args }) => ({
  path: `plugins/${name}${applySuffix(args, ["client", "server"], "mode")}.ts`,
  contents: `
export default defineNuxtPlugin((nuxtApp) => {})
  `
});
const component = ({ name, args }) => ({
  path: `components/${name}${applySuffix(
    args,
    ["client", "server"],
    "mode"
  )}.vue`,
  contents: `
<script lang="ts" setup><\/script>

<template>
  <div>
    Component: ${name}
  </div>
</template>

<style scoped></style>
`
});
const composable = ({ name }) => {
  const nameWithUsePrefix = name.startsWith("use") ? name : `use${upperFirst(name)}`;
  return {
    path: `composables/${name}.ts`,
    contents: `
export const ${nameWithUsePrefix} = () => {
  return ref()
}
  `
  };
};
const middleware = ({ name, args }) => ({
  path: `middleware/${name}${applySuffix(args, ["global"])}.ts`,
  contents: `
export default defineNuxtRouteMiddleware((to, from) => {})
`
});
const layout = ({ name }) => ({
  path: `layouts/${name}.vue`,
  contents: `
<script lang="ts" setup><\/script>

<template>
  <div>
    Layout: ${name}
    <slot />
  </div>
</template>

<style scoped></style>
`
});
const page = ({ name }) => ({
  path: `pages/${name}.vue`,
  contents: `
<script lang="ts" setup><\/script>

<template>
  <div>
    Page: ${name}
  </div>
</template>

<style scoped></style>
`
});
const templates = {
  api,
  plugin,
  component,
  composable,
  middleware,
  layout,
  page
};
function applySuffix(args, suffixes, unwrapFrom) {
  let suffix = "";
  for (const s of suffixes) {
    if (args[s]) {
      suffix += "." + s;
    }
  }
  if (unwrapFrom && args[unwrapFrom] && suffixes.includes(args[unwrapFrom])) {
    suffix += "." + args[unwrapFrom];
  }
  return suffix;
}

const add = defineCommand({
  meta: {
    name: "add",
    description: "Create a new template file."
  },
  args: {
    ...sharedArgs,
    force: {
      type: "boolean",
      description: "Override existing file"
    },
    template: {
      type: "positional",
      required: true,
      valueHint: Object.keys(templates).join("|"),
      description: `Template type to scafold`
    },
    name: {
      type: "positional",
      required: true,
      description: "Generated file name"
    }
  },
  async run(ctx) {
    const cwd = resolve(ctx.args.cwd || ".");
    const template = ctx.args.template;
    const ext = extname(ctx.args.name);
    const name = ext === ".vue" || ext === ".ts" ? ctx.args.name.replace(ext, "") : ctx.args.name;
    if (!templates[template]) {
      consola.error(
        `Template ${template} is not supported. Possible values: ${Object.keys(
          templates
        ).join(", ")}`
      );
      process.exit(1);
    }
    if (!name) {
      consola.error("name argument is missing!");
      process.exit(1);
    }
    const kit = await loadKit(cwd);
    const config = await kit.loadNuxtConfig({ cwd });
    const res = templates[template]({ name, args: ctx.args });
    const path = resolve(config.srcDir, res.path);
    if (!ctx.args.force && existsSync(path)) {
      consola.error(
        `File exists: ${path} . Use --force to override or use a different name.`
      );
      process.exit(1);
    }
    const parentDir = dirname(path);
    if (!existsSync(parentDir)) {
      consola.info("Creating directory", parentDir);
      if (template === "page") {
        consola.info("This enables vue-router functionality!");
      }
      await promises.mkdir(parentDir, { recursive: true });
    }
    await promises.writeFile(path, res.contents.trim() + "\n");
    consola.info(`\u{1FA84} Generated a new ${template} in ${path}`);
  }
});

export { add as default };
