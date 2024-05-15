<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <slot name="top" />

    <UContainer :class="ui.container">
      <div :class="ui.base">
        <div v-if="$slots.headline" :class="ui.headline">
          <slot name="headline" />
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

      <slot />
    </UContainer>

    <slot name="bottom" />
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
  links: {
    type: Array as PropType<(Button & { click?: Function })[]>,
    default: () => []
  },
  orientation: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'vertical'
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
    'gap-16 sm:gap-y-24',
    props.orientation === 'vertical' && 'flex flex-col',
    props.orientation === 'horizontal' && 'grid lg:grid-cols-2 lg:items-center'
  )

  const base: string = props.orientation === 'vertical' ? 'text-center' : ''

  const links: string = twJoin(
    'mt-10 flex flex-wrap gap-x-6 gap-y-3',
    props.orientation === 'vertical' && 'justify-center'
  )

  return {
    wrapper: 'py-24 sm:py-32 md:py-40 relative',
    container,
    base,
    headline: 'mb-10',
    title: 'text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl',
    description: 'mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300',
    links
  }
})

const { ui, attrs } = useUI('landing.hero', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
