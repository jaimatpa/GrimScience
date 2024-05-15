<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <div v-if="$slots.left" :class="ui.left">
      <slot name="left" />
    </div>

    <div :class="centerClass">
      <slot />
    </div>

    <div v-if="$slots.right" :class="ui.right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const config = {
  wrapper: 'flex flex-col lg:grid lg:grid-cols-10 lg:gap-8',
  left: 'lg:col-span-2',
  center: {
    narrow: 'lg:col-span-6',
    base: 'lg:col-span-8',
    full: 'lg:col-span-10'
  },
  right: 'lg:col-span-2 order-first lg:order-last'
}

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  },
  ui: {
    type: Object as PropType<Partial<typeof config>>,
    default: () => ({})
  }
})

const slots = useSlots()
const { ui, attrs } = useUI('page', toRef(props, 'ui'), config, toRef(props, 'class'), true)

const centerClass = computed(() => {
  if (slots.left && slots.right) {
    return ui.value.center.narrow
  } else if (slots.left || slots.right) {
    return ui.value.center.base
  }

  return ui.value.center.full
})
</script>
