<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const config = {
  wrapper: 'column-1 md:columns-2 lg:columns-3 gap-8 space-y-8'
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

const { ui, attrs } = useUI('page.columns', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
