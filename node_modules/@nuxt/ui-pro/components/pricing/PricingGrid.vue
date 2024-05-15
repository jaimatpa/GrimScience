<template>
  <div :class="[ui.wrapper, compact && 'gap-x-0']" v-bind="attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  compact: {
    type: Boolean,
    default: false
  },
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  },
  ui: {
    type: Object as PropType<Partial<typeof config>>,
    default: () => ({})
  }
})

const config = {
  wrapper: 'flex flex-col lg:grid lg:grid-cols-3 w-full justify-center items-center gap-8'
}

const { ui, attrs } = useUI('pricing.grid', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
