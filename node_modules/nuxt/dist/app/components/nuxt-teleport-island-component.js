import { Teleport, defineComponent, h, inject, provide } from "vue";
import { useNuxtApp } from "../nuxt.js";
import { paths } from "#build/components-chunk";
export const NuxtTeleportIslandSymbol = Symbol("NuxtTeleportIslandComponent");
export default defineComponent({
  name: "NuxtTeleportIslandComponent",
  props: {
    to: {
      type: String,
      required: true
    },
    nuxtClient: {
      type: Boolean,
      default: false
    },
    /**
     * ONLY used in dev mode since we use build:manifest result in production
     * do not pass any value in production
     */
    rootDir: {
      type: String,
      default: null
    }
  },
  setup(props, { slots }) {
    const nuxtApp = useNuxtApp();
    if (!nuxtApp.ssrContext?.islandContext || !props.nuxtClient || inject(NuxtTeleportIslandSymbol, false)) {
      return () => slots.default?.();
    }
    provide(NuxtTeleportIslandSymbol, props.to);
    const islandContext = nuxtApp.ssrContext.islandContext;
    return () => {
      const slot = slots.default()[0];
      const slotType = slot.type;
      const name = slotType.__name || slotType.name;
      islandContext.components[props.to] = {
        chunk: import.meta.dev ? "_nuxt/" + paths[name] : paths[name],
        props: slot.props || {}
      };
      return [h("div", {
        style: "display: contents;",
        "data-island-uid": "",
        "data-island-component": props.to
      }, []), h(Teleport, { to: props.to }, slot)];
    };
  }
});
