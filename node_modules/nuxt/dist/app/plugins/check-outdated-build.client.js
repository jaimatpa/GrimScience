import { defineNuxtPlugin } from "../nuxt.js";
import { getAppManifest } from "../composables/manifest.js";
import { onNuxtReady } from "../composables/ready.js";
import { buildAssetsURL } from "#internal/nuxt/paths";
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.test) {
    return;
  }
  let timeout;
  async function getLatestManifest() {
    const currentManifest = await getAppManifest();
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(getLatestManifest, 1e3 * 60 * 60);
    try {
      const meta = await $fetch(buildAssetsURL("builds/latest.json") + `?${Date.now()}`);
      if (meta.id !== currentManifest.id) {
        nuxtApp.hooks.callHook("app:manifest:update", meta);
      }
    } catch {
    }
  }
  onNuxtReady(() => {
    timeout = setTimeout(getLatestManifest, 1e3 * 60 * 60);
  });
});
