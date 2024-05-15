<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const config = {
  wrapper: 'mt-5 space-y-5 divide-y divide-gray-200 dark:divide-gray-800 [&>div]:pt-5 [&>div:first-child]:pt-0 [&>div:first-child]:mt-0'
}

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  }
})

const { ui, attrs } = useUI('content.fieldGroup', undefined, config, toRef(props, 'class'), true)
</script>
