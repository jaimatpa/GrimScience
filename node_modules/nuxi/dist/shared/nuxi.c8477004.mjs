import { g as gray, a as green, b as bold } from './nuxi.d3241ca4.mjs';
import { t as tryRequireModule } from './nuxi.5aaa4630.mjs';

function showVersions(cwd) {
  const getPkgVersion = (pkg) => {
    return tryRequireModule(`${pkg}/package.json`, cwd)?.version || "";
  };
  const nuxtVersion = getPkgVersion("nuxt") || getPkgVersion("nuxt-nightly") || getPkgVersion("nuxt3") || getPkgVersion("nuxt-edge");
  const nitroVersion = getPkgVersion("nitropack") || getPkgVersion("nitropack-edge");
  console.log(
    gray(
      green(`Nuxt ${bold(nuxtVersion)}`) + (nitroVersion ? ` with Nitro ${bold(nitroVersion)}` : "")
    )
  );
}

export { showVersions as s };
