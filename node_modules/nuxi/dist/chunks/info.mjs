import os from 'node:os';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { j as jiti } from '../shared/nuxi.73800aa7.mjs';
import { d as destr } from '../shared/nuxi.4ac76f59.mjs';
import { s as splitByCase } from '../shared/nuxi.349af404.mjs';
import clipboardy from './index6.mjs';
import { g as getPackageManager, a as getPackageManagerVersion } from '../shared/nuxi.17654120.mjs';
import { f as findup } from '../shared/nuxi.1ff5d6e2.mjs';
import { d as defineCommand, n as nuxiPkg } from '../shared/nuxi.9edf0930.mjs';
import { s as sharedArgs, l as legacyRootDirArgs, r as resolve } from '../shared/nuxi.610c92ff.mjs';
import '../shared/nuxi.2155838d.mjs';
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
import 'node:process';
import './index3.mjs';
import 'node:buffer';
import 'node:path';
import 'node:child_process';
import 'child_process';
import 'node:url';
import 'node:timers/promises';
import 'stream';
import 'node:util';
import 'node:tty';

const info = defineCommand({
  meta: {
    name: "info",
    description: "Get information about Nuxt project"
  },
  args: {
    ...sharedArgs,
    ...legacyRootDirArgs
  },
  async run(ctx) {
    const cwd = resolve(ctx.args.cwd || ctx.args.rootDir || ".");
    const nuxtConfig = getNuxtConfig(cwd);
    const { dependencies = {}, devDependencies = {} } = findPackage(cwd);
    const getDepVersion = (name) => getPkg(name, cwd)?.version || dependencies[name] || devDependencies[name];
    const listModules = (arr = []) => arr.map((m) => normalizeConfigModule(m, cwd)).filter(Boolean).map((name) => {
      const npmName = name.split("/").splice(0, 2).join("/");
      const v = getDepVersion(npmName);
      return "`" + (v ? `${name}@${v}` : name) + "`";
    }).join(", ");
    const nuxtVersion = getDepVersion("nuxt") || getDepVersion("nuxt-nightly") || getDepVersion("nuxt-edge") || getDepVersion("nuxt3") || "-";
    const isLegacy = nuxtVersion.startsWith("2");
    const builder = !isLegacy ? nuxtConfig.builder || "-" : nuxtConfig.bridge?.vite ? "vite" : nuxtConfig.buildModules?.includes("nuxt-vite") ? "vite" : "webpack";
    let packageManager = getPackageManager(cwd);
    if (packageManager) {
      packageManager += "@" + getPackageManagerVersion(packageManager);
    } else {
      packageManager = "unknown";
    }
    const infoObj = {
      OperatingSystem: os.type(),
      NodeVersion: process.version,
      NuxtVersion: nuxtVersion,
      CLIVersion: nuxiPkg.version,
      NitroVersion: getDepVersion("nitropack"),
      PackageManager: packageManager,
      Builder: builder,
      UserConfig: Object.keys(nuxtConfig).map((key) => "`" + key + "`").join(", "),
      RuntimeModules: listModules(nuxtConfig.modules),
      BuildModules: listModules(nuxtConfig.buildModules || [])
    };
    console.log("Working directory:", cwd);
    let maxLength = 0;
    const entries = Object.entries(infoObj).map(([key, val]) => {
      const label = splitByCase(key).join(" ");
      if (label.length > maxLength) {
        maxLength = label.length;
      }
      return [label, val || "-"];
    });
    let infoStr = "";
    for (const [label, value] of entries) {
      infoStr += "- " + (label + ": ").padEnd(maxLength + 2) + (value.includes("`") ? value : "`" + value + "`") + "\n";
    }
    const copied = await clipboardy.write(infoStr).then(() => true).catch(() => false);
    const splitter = "------------------------------";
    console.log(
      `Nuxt project info: ${copied ? "(copied to clipboard)" : ""}

${splitter}
${infoStr}${splitter}
`
    );
    const isNuxt3OrBridge = !isLegacy || infoObj.BuildModules.includes("bridge");
    console.log(
      [
        "\u{1F449} Report an issue: https://github.com/nuxt/nuxt/issues/new",
        "\u{1F449} Suggest an improvement: https://github.com/nuxt/nuxt/discussions/new",
        `\u{1F449} Read documentation: ${isNuxt3OrBridge ? "https://nuxt.com" : "https://v2.nuxt.com"}`
      ].join("\n\n") + "\n"
    );
  }
});
function normalizeConfigModule(module, rootDir) {
  if (!module) {
    return null;
  }
  if (typeof module === "string") {
    return module.split(rootDir).pop().split("node_modules").pop().replace(/^\//, "");
  }
  if (typeof module === "function") {
    return `${module.name}()`;
  }
  if (Array.isArray(module)) {
    return normalizeConfigModule(module[0], rootDir);
  }
  return null;
}
function getNuxtConfig(rootDir) {
  try {
    ;
    globalThis.defineNuxtConfig = (c) => c;
    const result = jiti(rootDir, { interopDefault: true, esmResolve: true })(
      "./nuxt.config"
    );
    delete globalThis.defineNuxtConfig;
    return result;
  } catch (err) {
    return {};
  }
}
function getPkg(name, rootDir) {
  let pkgPath = resolve(rootDir, "node_modules", name, "package.json");
  const _require = createRequire(rootDir);
  try {
    pkgPath = _require.resolve(name + "/package.json");
  } catch (_err) {
  }
  return readJSONSync(pkgPath);
}
function findPackage(rootDir) {
  return findup(rootDir, (dir) => {
    const p = resolve(dir, "package.json");
    if (existsSync(p)) {
      return readJSONSync(p);
    }
  }) || {};
}
function readJSONSync(filePath) {
  try {
    return destr(readFileSync(filePath, "utf-8"));
  } catch (err) {
    return null;
  }
}

export { info as default };
