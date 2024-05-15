import { execSync } from 'node:child_process';
import { d as defineCommand, c as consola, a as colors } from '../shared/nuxi.9edf0930.mjs';
import 'node:util';
import 'node:path';
import 'node:process';
import 'node:tty';
import { l as loadKit, r as readPackageJSON } from '../shared/nuxi.dc1b30dc.mjs';
import { g as getPackageManager, p as packageManagerLocks } from '../shared/nuxi.17654120.mjs';
import { r as rmRecursive, t as touchFile } from '../shared/nuxi.1ff5d6e2.mjs';
import { c as cleanupNuxtDirs, n as nuxtVersionToGitIdentifier } from '../shared/nuxi.1e36f2d5.mjs';
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

async function getNuxtVersion(path) {
  try {
    const pkg = await readPackageJSON("nuxt", { url: path });
    if (!pkg.version) {
      consola.warn("Cannot find any installed Nuxt versions in ", path);
    }
    return pkg.version || null;
  } catch {
    return null;
  }
}
const upgrade = defineCommand({
  meta: {
    name: "upgrade",
    description: "Upgrade Nuxt"
  },
  args: {
    ...sharedArgs,
    ...legacyRootDirArgs,
    force: {
      type: "boolean",
      alias: "f",
      description: "Force upgrade to recreate lockfile and node_modules"
    }
  },
  async run(ctx) {
    const cwd = resolve(ctx.args.cwd || ctx.args.rootDir || ".");
    const packageManager = getPackageManager(cwd);
    if (!packageManager) {
      consola.error(
        `Unable to determine the package manager used by this project.

No lock files found in \`${cwd}\`, and no \`packageManager\` field specified in \`package.json\`.

Please either add the \`packageManager\` field to \`package.json\` or execute the installation command for your package manager. For example, you can use \`pnpm i\`, \`npm i\`, \`bun i\`, or \`yarn i\`, and then try again.`
      );
      process.exit(1);
    }
    const packageManagerVersion = execSync(`${packageManager} --version`).toString("utf8").trim();
    consola.info("Package manager:", packageManager, packageManagerVersion);
    const currentVersion = await getNuxtVersion(cwd) || "[unknown]";
    consola.info("Current Nuxt version:", currentVersion);
    const pmLockFile = resolve(cwd, packageManagerLocks[packageManager]);
    const forceRemovals = ["node_modules", relative(process.cwd(), pmLockFile)].map((p) => colors.cyan(p)).join(" and ");
    if (ctx.args.force === void 0) {
      ctx.args.force = await consola.prompt(
        `Would you like to recreate ${forceRemovals} to fix problems with hoisted dependency versions and ensure you have the most up-to-date dependencies?`,
        {
          type: "confirm",
          default: true
        }
      );
    }
    if (ctx.args.force) {
      consola.info(
        `Recreating ${forceRemovals}. If you encounter any issues, revert the changes and try with \`--no-force\``
      );
      await rmRecursive([pmLockFile, resolve(cwd, "node_modules")]);
      await touchFile(pmLockFile);
    }
    consola.info("Installing latest Nuxt 3 release...");
    execSync(
      `${packageManager} ${packageManager === "yarn" ? "add" : "install"} -D nuxt`,
      { stdio: "inherit", cwd }
    );
    let buildDir = ".nuxt";
    try {
      const { loadNuxtConfig } = await loadKit(cwd);
      const nuxtOptions = await loadNuxtConfig({ cwd });
      buildDir = nuxtOptions.buildDir;
    } catch {
    }
    await cleanupNuxtDirs(cwd, buildDir);
    const upgradedVersion = await getNuxtVersion(cwd) || "[unknown]";
    consola.info("Upgraded Nuxt version:", upgradedVersion);
    if (upgradedVersion === currentVersion) {
      consola.success("You're already using the latest version of Nuxt.");
    } else {
      consola.success(
        "Successfully upgraded Nuxt from",
        currentVersion,
        "to",
        upgradedVersion
      );
      const commitA = nuxtVersionToGitIdentifier(currentVersion);
      const commitB = nuxtVersionToGitIdentifier(upgradedVersion);
      if (commitA && commitB) {
        consola.info(
          "Changelog:",
          `https://github.com/nuxt/nuxt/compare/${commitA}...${commitB}`
        );
      }
    }
  }
});

export { upgrade as default };
