<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <p :class="ui.status">
      {{ error?.statusCode || status }}
    </p>
    <h1 :class="ui.name">
      {{ error?.name || error?.statusMessage || name }}
    </h1>
    <p :class="ui.message">
      {{ error?.message && error.message !== (error.name || error.statusMessage || name) ? error.message : message }}
    </p>
    <div :class="ui.links">
      <UButton v-bind="{ ...ui.default.clearButton, ...clearButton }" @click="handleError" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { NuxtError } from '#app'
import type { Button } from '#ui/types'

const config = {
  wrapper: 'min-h-[calc(100vh-var(--header-height))] flex flex-col items-center justify-center',
  status: 'text-base font-semibold text-primary',
  name: 'text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl',
  message: 'mt-6 text-base/7 text-gray-500 dark:text-gray-400 text-center',
  links: 'mt-10 flex items-center justify-center gap-x-6',
  default: {
    clearButton: {
      label: 'Go back home',
      color: 'primary' as const,
      size: 'lg' as const
    }
  }
}

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  error: {
    type: Object as PropType<Partial<NuxtError>>,
    default: undefined
  },
  status: {
    type: Number,
    default: 404
  },
  name: {
    type: String,
    default: 'An error occurred'
  },
  message: {
    type: String,
    default: 'This is not the page you\'re looking for.'
  },
  clearButton: {
    type: Object as PropType<Button & { click?: Function }>,
    default: () => ({})
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

const { ui, attrs } = useUI('page.error', toRef(props, 'ui'), config, toRef(props, 'class'), true)

const handleError = () => clearError({ redirect: '/' })
</script>
