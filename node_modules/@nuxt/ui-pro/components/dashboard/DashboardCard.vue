<template>
  <UCard :ui="ui" :class="ui.wrapper" v-bind="attrs">
    <template v-if="$slots.header || (icon || $slots.icon) || (title || $slots.title) || (description || $slots.description)" #header>
      <slot name="header">
        <div :class="ui.header.inner">
          <div v-if="icon || $slots.icon" :class="ui.icon.wrapper">
            <slot name="icon">
              <UIcon :name="(icon as string)" :class="ui.icon.base" />
            </slot>
          </div>

          <div>
            <p v-if="title || $slots.title" :class="ui.title">
              <slot name="title">
                {{ title }}
              </slot>
            </p>

            <p v-if="description || $slots.description" :class="ui.description">
              <slot name="description">
                {{ description }}
              </slot>
            </p>
          </div>
        </div>

        <div v-if="links?.length || $slots.links" :class="ui.links">
          <slot name="links">
            <UButton v-for="(link, index) in links" :key="index" v-bind="link" @click="link.click" />
          </slot>
        </div>
      </slot>
    </template>

    <template v-if="$slots.default" #default>
      <slot />
    </template>

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { twMerge } from 'tailwind-merge'
import { card as cardConfig } from '#ui/ui.config'
import type { Button } from '#ui/types'

const slots = useSlots()

const config = computed(() => ({
  wrapper: '',
  divide: '',
  header: {
    base: 'flex flex-wrap items-center justify-between gap-2',
    inner: 'flex items-start gap-4',
    padding: twMerge('px-4 py-4 sm:px-6', (slots.default || slots.footer) ? 'pb-0' : undefined)
  },
  title: 'text-gray-900 dark:text-white font-semibold',
  description: 'mt-1 text-gray-500 dark:text-gray-400 text-sm',
  links: 'flex flex-wrap items-center gap-1.5',
  icon: {
    wrapper: 'inline-flex',
    base: 'w-12 h-12 flex-shrink-0 text-gray-900 dark:text-white'
  }
}))

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  icon: {
    type: String,
    default: undefined
  },
  title: {
    type: String,
    default: undefined
  },
  description: {
    type: String,
    default: undefined
  },
  links: {
    type: Array as PropType<(Button & { click?: Function })[]>,
    default: () => []
  },
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  },
  ui: {
    type: Object as PropType<Partial<typeof config.value & typeof cardConfig>>,
    default: () => ({})
  }
})

const { ui, attrs } = useUI('dashboard.card', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
