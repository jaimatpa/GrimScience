<template>
  <div :class="[ui.wrapper, prose && ui.prose]" v-bind="attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const config = {
  wrapper: 'mt-8 pb-24',
  prose: 'prose prose-primary dark:prose-invert max-w-none'
}

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  prose: {
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

const { ui, attrs } = useUI('page.body', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
