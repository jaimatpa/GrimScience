import { promises } from 'node:fs';
import { resolve, join } from 'pathe';
import { defineNuxtModule, createResolver, addTemplate, addPlugin, addComponent, isNuxt2, addImports, tryResolveModule } from '@nuxt/kit';
import { readPackageJSON } from 'pkg-types';
import { gte } from 'semver';

const name = "@nuxtjs/color-mode";
const version = "3.4.1";
const description = "Dark and Light mode for Nuxt with auto detection";
const repository = {
	type: "git",
	url: "git+https://github.com/nuxt-modules/color-mode.git"
};
const license = "MIT";
const packageManager = "pnpm@9.0.6";
const contributors = [
	{
		name: "Nuxt Team"
	}
];
const type = "module";
const exports = {
	".": {
		types: "./dist/types.d.ts",
		"import": "./dist/module.mjs",
		require: "./dist/module.cjs"
	}
};
const main = "./dist/module.cjs";
const types = "./dist/types.d.ts";
const files = [
	"dist"
];
const scripts = {
	prepack: "nuxt-module-build build && esbuild --minify src/script.js --outfile=dist/script.min.js",
	build: "pnpm run prepack",
	dev: "nuxi dev playground",
	"dev:build": "nuxi build playground",
	"dev:prepare": "nuxt-module-build build --stub && nuxt-module-build prepare && nuxi prepare playground",
	lint: "eslint .",
	prepublishOnly: "pnpm run prepack",
	release: "pnpm test && standard-version && git push --follow-tags && npm publish",
	test: "vitest run --coverage"
};
const dependencies = {
	"@nuxt/kit": "^3.11.2",
	pathe: "^1.1.2",
	"pkg-types": "^1.1.0",
	semver: "^7.6.0"
};
const devDependencies = {
	"@commitlint/cli": "^19.3.0",
	"@commitlint/config-conventional": "^19.2.2",
	"@nuxt/eslint-config": "^0.3.10",
	"@nuxt/module-builder": "^0.6.0",
	"@nuxt/schema": "^3.11.2",
	"@nuxt/test-utils": "^3.12.1",
	"@types/lodash.template": "^4.5.3",
	"@typescript-eslint/parser": "^7.7.1",
	"@vitest/coverage-v8": "^1.5.2",
	eslint: "^9.1.1",
	husky: "9.0.11",
	nuxt: "^3.11.2",
	"standard-version": "^9.5.0",
	typescript: "^5.4.5",
	vitest: "^1.5.2",
	"vue-tsc": "^2.0.14"
};
const _package = {
	name: name,
	version: version,
	description: description,
	repository: repository,
	license: license,
	packageManager: packageManager,
	contributors: contributors,
	type: type,
	exports: exports,
	main: main,
	types: types,
	files: files,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies
};

const DEFAULTS = {
  preference: "system",
  fallback: "light",
  hid: "nuxt-color-mode-script",
  globalName: "__NUXT_COLOR_MODE__",
  componentName: "ColorScheme",
  classPrefix: "",
  classSuffix: "-mode",
  dataValue: "",
  storageKey: "nuxt-color-mode",
  disableTransition: false
};
const module = defineNuxtModule({
  meta: {
    name,
    version,
    configKey: "colorMode",
    compatibility: {
      bridge: true
    }
  },
  defaults: DEFAULTS,
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const scriptPath = await resolver.resolve("./script.min.js");
    const scriptT = await promises.readFile(scriptPath, "utf-8");
    options.script = scriptT.replace(/<%= options\.([^ ]+) %>/g, (_, option) => options[option]);
    nuxt.options.alias["#color-mode-options"] = addTemplate({
      filename: "color-mode-options.mjs",
      getContents: () => Object.entries(options).map(([key, value]) => `export const ${key} = ${JSON.stringify(value, null, 2)}
      `).join("\n")
    }).dst;
    const runtimeDir = await resolver.resolve("./runtime");
    nuxt.options.build.transpile.push(runtimeDir);
    for (const template of ["plugin.client", "plugin.server"]) {
      addPlugin(resolve(runtimeDir, template));
    }
    addComponent({ name: options.componentName, filePath: resolve(runtimeDir, "component." + (isNuxt2() ? "vue2" : "vue3") + ".vue") });
    addImports({ name: "useColorMode", as: "useColorMode", from: resolve(runtimeDir, "composables") });
    nuxt.hook("nitro:config", (config) => {
      config.externals = config.externals || {};
      config.externals.inline = config.externals.inline || [];
      config.externals.inline.push(runtimeDir);
      config.virtual = config.virtual || {};
      config.virtual["#color-mode-options"] = `export const script = ${JSON.stringify(options.script, null, 2)}`;
      config.plugins = config.plugins || [];
      config.plugins.push(resolve(runtimeDir, "nitro-plugin"));
    });
    nuxt.hook("tailwindcss:config", async (tailwindConfig) => {
      const tailwind = await tryResolveModule("tailwindcss", nuxt.options.modulesDir) || "tailwindcss";
      const isAfter341 = await readPackageJSON(tailwind).then((twPkg) => gte(twPkg.version || "3.0.0", "3.4.1"));
      tailwindConfig.darkMode = tailwindConfig.darkMode ?? [isAfter341 ? "selector" : "class", `[class~="${options.classPrefix}dark${options.classSuffix}"]`];
    });
    if (!isNuxt2()) {
      return;
    }
    nuxt.hook("vue-renderer:spa:prepareContext", ({ head }) => {
      const script = {
        hid: options.hid,
        innerHTML: options.script,
        pbody: true
      };
      head.script.push(script);
      const serializeProp = "__dangerouslyDisableSanitizersByTagID";
      head[serializeProp] = head[serializeProp] || {};
      head[serializeProp][options.hid] = ["innerHTML"];
    });
    const createHash = await import('node:crypto').then((r) => r.createHash);
    nuxt.hook("vue-renderer:ssr:csp", (cspScriptSrcHashes) => {
      const { csp } = nuxt.options.render;
      const hash = createHash(csp.hashAlgorithm);
      hash.update(options.script);
      cspScriptSrcHashes.push(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        `'${csp.hashAlgorithm}-${hash.digest("base64")}'`
      );
    });
    if (nuxt.options.dev) {
      const { dst } = addTemplate({
        src: scriptPath,
        filename: join("color-mode", "script.min.js"),
        options
      });
      nuxt.hook("webpack:config", (configs) => {
        for (const config of configs) {
          if (config.name !== "server") {
            config.entry.app.unshift(resolve(nuxt.options.buildDir, dst));
          }
        }
      });
    }
  }
});

export { module as default };
