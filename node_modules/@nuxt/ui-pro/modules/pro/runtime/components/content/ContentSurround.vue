<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <UContentSurroundLink
      v-if="prev"
      :link="prev"
      :ui="ui.link"
      :icon="ui.icon.prev"
    />
    <span v-else class="hidden sm:block">&nbsp;</span>
    <UContentSurroundLink
      v-if="next"
      :link="next"
      :ui="ui.link"
      :icon="ui.icon.next"
      class="text-right"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

const config = {
  wrapper: 'grid gap-8 sm:grid-cols-2',
  icon: {
    prev: 'i-heroicons-arrow-left-20-solid',
    next: 'i-heroicons-arrow-right-20-solid'
  },
  link: {}
}

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  surround: {
    type: Array as PropType<Pick<ParsedContent, string>[]>,
    default: () => []
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

const { ui, attrs } = useUI('content.surround', toRef(props, 'ui'), config, toRef(props, 'class'), true)

const [prev, next] = props.surround || []
</script>
