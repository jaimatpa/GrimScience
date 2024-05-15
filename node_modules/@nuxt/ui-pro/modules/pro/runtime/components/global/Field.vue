<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <div :class="ui.container">
      <div :class="ui.label">
        <span :class="ui.name">{{ name }}</span>
        <span v-if="required" :class="ui.required">required</span>
      </div>

      <div v-if="type" :class="ui.type">
        {{ type }}
      </div>
    </div>

    <div v-if="$slots.default || description" :class="ui.description">
      <slot>
        {{ description }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const config = {
  wrapper: 'mt-5',
  container: 'flex items-start gap-x-2.5 font-mono text-sm',
  name: 'rounded-md font-semibold text-primary',
  required: 'text-gray-500 dark:text-gray-400',
  type: 'text-right',
  label: 'flex flex-1 gap-x-2.5',
  description: 'mt-3 mb-0 text-gray-600 dark:text-gray-300 text-sm space-y-3'
}

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: undefined
  },
  type: {
    type: String,
    default: undefined
  },
  required: {
    type: Boolean,
    default: false
  },
  default: {
    type: String,
    default: undefined
  },
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  }
})

const { ui, attrs } = useUI('content.field', undefined, config, toRef(props, 'class'), true)
</script>
