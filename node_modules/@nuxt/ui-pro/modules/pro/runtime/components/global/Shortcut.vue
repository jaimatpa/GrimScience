<template>
  <UKbd :class="ui.wrapper" v-bind="attrs">
    {{ shortcut }}
  </UKbd>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const config = {
  wrapper: '!my-0 align-text-top'
}

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  }
})

const { metaSymbol } = useShortcuts()
const { ui, attrs } = useUI('content.shortcut', undefined, config, toRef(props, 'class'), true)

const shortcut = computed(() => props.value === 'meta' ? metaSymbol.value : props.value)
</script>
