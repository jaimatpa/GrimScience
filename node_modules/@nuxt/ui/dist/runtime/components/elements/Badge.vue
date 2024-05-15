<template>
  <span :class="badgeClass" v-bind="attrs">
    <slot>{{ label }}</slot>
  </span>
</template>

<script>
import { computed, toRef, defineComponent } from "vue";
import { twMerge, twJoin } from "tailwind-merge";
import { useUI } from "../../composables/useUI";
import { mergeConfig } from "../../utils";
import { useInjectButtonGroup } from "../../composables/useButtonGroup";
import appConfig from "#build/app.config";
import { badge } from "#ui/ui.config";
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.badge, badge);
export default defineComponent({
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: () => config.default.size,
      validator(value) {
        return Object.keys(config.size).includes(value);
      }
    },
    color: {
      type: String,
      default: () => config.default.color,
      validator(value) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value);
      }
    },
    variant: {
      type: String,
      default: () => config.default.variant,
      validator(value) {
        return [
          ...Object.keys(config.variant),
          ...Object.values(config.color).flatMap((value2) => Object.keys(value2))
        ].includes(value);
      }
    },
    label: {
      type: [String, Number],
      default: null
    },
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { ui, attrs } = useUI("badge", toRef(props, "ui"), config);
    const { size, rounded } = useInjectButtonGroup({ ui, props });
    const badgeClass = computed(() => {
      const variant = ui.value.color?.[props.color]?.[props.variant] || ui.value.variant[props.variant];
      return twMerge(twJoin(
        ui.value.base,
        ui.value.font,
        rounded.value,
        ui.value.size[size.value],
        variant?.replaceAll("{color}", props.color)
      ), props.class);
    });
    return {
      attrs,
      badgeClass
    };
  }
});
</script>
