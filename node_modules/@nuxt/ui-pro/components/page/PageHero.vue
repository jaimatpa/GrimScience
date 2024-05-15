<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <div :class="ui.container">
      <div v-if="(icon || $slots.icon) || (title || $slots.title) || (description || $slots.description) || (links?.length || $slots.links)" :class="ui.base">
        <div v-if="icon || $slots.icon" :class="ui.icon.wrapper">
          <slot name="icon">
            <UIcon :name="(icon as string)" :class="ui.icon.base" />
          </slot>
        </div>

        <h1 :class="ui.title">
          <slot name="title">
            {{ title }}
          </slot>
        </h1>

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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { twJoin } from 'tailwind-merge'
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
  icon: {
    type: String,
    default: undefined
  },
  links: {
    type: Array as PropType<(Button & { click?: Function })[]>,
    default: () => []
  },
  align: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left'
  },
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  },
  ui: {
    type: Object as PropType<Partial<typeof config.value>>,
    default: () => ({})
  }
})

const config = computed(() => {
  const container: string = twJoin(
    'gap-8 sm:gap-y-16',
    props.align === 'center' ? 'flex flex-col' : 'grid lg:grid-cols-2 lg:items-center'
  )

  const base: string = twJoin(
    '',
    props.align === 'center' && 'text-center flex flex-col items-center',
    props.align === 'right' && 'lg:order-last'
  )

  const links: string = twJoin(
    'mt-8 flex flex-wrap gap-x-3 gap-y-1.5',
    props.align === 'center' && 'justify-center'
  )

  return {
    wrapper: 'py-8 sm:py-16',
    container,
    base,
    icon: {
      wrapper: 'flex mb-4',
      base: 'w-10 h-10 flex-shrink-0 text-primary'
    },
    title: 'text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl',
    description: 'mt-4 text-lg text-gray-500 dark:text-gray-400',
    links
  }
})

const { ui, attrs } = useUI('page.hero', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
