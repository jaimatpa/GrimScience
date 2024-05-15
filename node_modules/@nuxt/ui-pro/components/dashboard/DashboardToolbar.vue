<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <div :class="ui.container">
      <slot>
        <div :class="ui.left">
          <slot name="left" />
        </div>

        <div :class="ui.right">
          <slot name="right" />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const config = {
  wrapper: 'min-h-[49px] flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 py-2 gap-x-4',
  container: 'flex items-center justify-between flex-1 gap-x-1.5',
  left: 'flex items-stretch gap-1.5',
  right: 'flex items-stretch gap-1.5'
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

const { ui, attrs } = useUI('dashboard.toolbar', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
