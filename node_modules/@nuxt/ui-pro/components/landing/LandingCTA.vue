<template>
  <UCard :class="ui.wrapper" v-bind="attrs" :ui="ui">
    <div :class="ui.container">
      <h2 v-if="title || $slots.title" :class="ui.title">
        <slot name="title">
          {{ title }}
        </slot>
      </h2>

      <p v-if="description || $slots.description" :class="ui.description">
        <slot name="description">
          {{ description }}
        </slot>
      </p>

      <div v-if="links?.length || $slots.links" :class="ui.links">
        <slot name="links">
          <UButton v-for="(link, index) in links" :key="index" v-bind="link" @click="link.click" />
        </slot>
      </div>
    </div>

    <slot v-if="$slots.default" />
    <div v-else-if="align === 'right'" />
  </UCard>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { twJoin } from 'tailwind-merge'
import { card as cardConfig } from '#ui/ui.config'
import type { Button } from '#ui/types'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  title: {
    type: String,
    default: undefined
  },
  description: {
    type: String,
    default: undefined
  },
  card: {
    type: Boolean,
    default: true
  },
  links: {
    type: Array as PropType<(Button & { click?: Function })[]>,
    default: () => []
  },
  align: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'center'
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

const config = computed(() => {
  const card: Record<string, string> = {}

  if (props.card) {
    card.rounded = 'rounded-xl'
  } else {
    card.ring = ''
    card.rounded = ''
    card.background = ''
    card.shadow = ''
    card.divide = ''
  }

  const container: string = twJoin(
    '',
    props.align === 'center' && 'text-center',
    props.align === 'right' && 'lg:order-last'
  )

  const base = twJoin(
    'flex flex-col',
    props.align !== 'center' && 'lg:grid lg:grid-cols-2 lg:items-center',
    'gap-16 sm:gap-y-24'
  )

  const padding: string = props.card ? 'py-24 sm:py-32 sm:px-16' : 'py-24 sm:py-32 px-6 lg:px-8'

  const links: string = twJoin(
    'mt-10 flex items-center gap-x-6',
    props.align === 'center' && 'justify-center'
  )

  return {
    ...card,
    wrapper: 'relative',
    container,
    body: {
      base,
      padding
    },
    title: 'text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl',
    description: 'mt-6 text-lg/8 text-gray-600 dark:text-gray-300',
    links
  }
})

const { ui, attrs } = useUI('landing.cta', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
