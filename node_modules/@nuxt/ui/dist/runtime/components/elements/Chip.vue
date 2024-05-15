<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <slot />

    <span v-if="show" :class="chipClass">
      <slot name="content">
        {{ text }}
      </slot>
    </span>
  </div>
</template>

<script>
import { defineComponent, computed, toRef } from "vue";
import { twJoin } from "tailwind-merge";
import { useUI } from "../../composables/useUI";
import { mergeConfig } from "../../utils";
import appConfig from "#build/app.config";
import { chip } from "#ui/ui.config";
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.chip, chip);
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
        return ["gray", ...appConfig.ui.colors].includes(value);
      }
    },
    position: {
      type: String,
      default: () => config.default.position,
      validator(value) {
        return Object.keys(config.position).includes(value);
      }
    },
    text: {
      type: [String, Number],
      default: null
    },
    inset: {
      type: Boolean,
      default: () => config.default.inset
    },
    show: {
      type: Boolean,
      default: true
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
    const { ui, attrs } = useUI("chip", toRef(props, "ui"), config, toRef(props, "class"));
    const chipClass = computed(() => {
      return twJoin(
        ui.value.base,
        ui.value.size[props.size],
        ui.value.position[props.position],
        props.inset ? null : ui.value.translate[props.position],
        ui.value.background.replaceAll("{color}", props.color)
      );
    });
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      chipClass
    };
  }
});
</script>
