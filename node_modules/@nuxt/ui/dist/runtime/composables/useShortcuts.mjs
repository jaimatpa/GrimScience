import { createSharedComposable, useActiveElement } from "@vueuse/core";
import { ref, computed, onMounted } from "vue";
export const _useShortcuts = () => {
  const macOS = computed(() => import.meta.client && navigator && navigator.userAgent && navigator.userAgent.match(/Macintosh;/));
  const metaSymbol = ref(" ");
  const activeElement = useActiveElement();
  const usingInput = computed(() => {
    const tagName = activeElement.value?.tagName;
    const contentEditable = activeElement.value?.contentEditable;
    const usingInput2 = !!(tagName === "INPUT" || tagName === "TEXTAREA" || contentEditable === "true" || contentEditable === "plaintext-only");
    if (usingInput2) {
      return activeElement.value?.name || true;
    }
    return false;
  });
  onMounted(() => {
    metaSymbol.value = macOS.value ? "\u2318" : "Ctrl";
  });
  return {
    macOS,
    metaSymbol,
    activeElement,
    usingInput
  };
};
export const useShortcuts = createSharedComposable(_useShortcuts);
