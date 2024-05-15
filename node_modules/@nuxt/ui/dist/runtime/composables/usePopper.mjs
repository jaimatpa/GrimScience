import { ref, onMounted, watchEffect } from "vue";
import { popperGenerator, defaultModifiers } from "@popperjs/core/lib/popper-lite";
import flip from "@popperjs/core/lib/modifiers/flip";
import offset from "@popperjs/core/lib/modifiers/offset";
import preventOverflow from "@popperjs/core/lib/modifiers/preventOverflow";
import computeStyles from "@popperjs/core/lib/modifiers/computeStyles";
import eventListeners from "@popperjs/core/lib/modifiers/eventListeners";
import arrowModifier from "@popperjs/core/lib/modifiers/arrow";
import { unrefElement } from "@vueuse/core";
export const createPopper = popperGenerator({
  defaultModifiers: [...defaultModifiers, offset, flip, preventOverflow, computeStyles, eventListeners, arrowModifier]
});
export function usePopper({
  locked = false,
  overflowPadding = 8,
  offsetDistance = 8,
  offsetSkid = 0,
  gpuAcceleration = true,
  adaptive = true,
  scroll = true,
  resize = true,
  arrow = false,
  placement,
  strategy
}, virtualReference) {
  const reference = ref(null);
  const popper = ref(null);
  const instance = ref(null);
  onMounted(() => {
    watchEffect((onInvalidate) => {
      if (!popper.value) {
        return;
      }
      if (!reference.value && !virtualReference?.value) {
        return;
      }
      const popperEl = unrefElement(popper);
      const referenceEl = virtualReference?.value || unrefElement(reference);
      if (!(popperEl instanceof HTMLElement)) {
        return;
      }
      if (!referenceEl) {
        return;
      }
      const config = {
        modifiers: [
          {
            name: "flip",
            enabled: !locked
          },
          {
            name: "preventOverflow",
            options: {
              padding: overflowPadding
            }
          },
          {
            name: "offset",
            options: {
              offset: [offsetSkid, offsetDistance]
            }
          },
          {
            name: "computeStyles",
            options: {
              adaptive,
              gpuAcceleration
            }
          },
          {
            name: "eventListeners",
            options: {
              scroll,
              resize
            }
          },
          {
            name: "arrow",
            enabled: arrow
          }
        ]
      };
      if (placement) {
        config.placement = placement;
      }
      if (strategy) {
        config.strategy = strategy;
      }
      instance.value = createPopper(referenceEl, popperEl, config);
      onInvalidate(instance.value.destroy);
    });
  });
  return [reference, popper, instance];
}
