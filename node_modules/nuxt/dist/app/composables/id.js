import { getCurrentInstance, inject } from "vue";
import { useNuxtApp } from "../nuxt.js";
import { clientOnlySymbol } from "#app/components/client-only";
const ATTR_KEY = "data-n-ids";
const SEPARATOR = "-";
export function useId(key) {
  if (typeof key !== "string") {
    throw new TypeError("[nuxt] [useId] key must be a string.");
  }
  key = `n${key.slice(1)}`;
  const nuxtApp = useNuxtApp();
  const instance = getCurrentInstance();
  if (!instance) {
    throw new TypeError("[nuxt] `useId` must be called within a component setup function.");
  }
  nuxtApp._id ||= 0;
  instance._nuxtIdIndex ||= {};
  instance._nuxtIdIndex[key] ||= 0;
  const instanceIndex = key + SEPARATOR + instance._nuxtIdIndex[key]++;
  if (import.meta.server) {
    const ids = JSON.parse(instance.attrs[ATTR_KEY] || "{}");
    ids[instanceIndex] = key + SEPARATOR + nuxtApp._id++;
    instance.attrs[ATTR_KEY] = JSON.stringify(ids);
    return ids[instanceIndex];
  }
  if (nuxtApp.payload.serverRendered && nuxtApp.isHydrating && !inject(clientOnlySymbol, false)) {
    const el = instance.vnode.el?.nodeType === 8 && instance.vnode.el?.nextElementSibling?.getAttribute ? instance.vnode.el?.nextElementSibling : instance.vnode.el;
    const ids = JSON.parse(el?.getAttribute?.(ATTR_KEY) || "{}");
    if (ids[instanceIndex]) {
      return ids[instanceIndex];
    }
    if (import.meta.dev && instance.vnode.type && typeof instance.vnode.type === "object" && "inheritAttrs" in instance.vnode.type && instance.vnode.type.inheritAttrs === false) {
      console.warn("[nuxt] `useId` might not work correctly with components that have `inheritAttrs: false`.");
    }
  }
  return key + "_" + nuxtApp._id++;
}
