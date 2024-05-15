<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <slot name="top" />

    <UContainer :class="ui.container">
      <div v-if="(icon || $slots.icon) || (headline || $slots.headline) || (title || $slots.title) || (description || $slots.description) || (links?.length || $slots.links)" :class="ui.base">
        <div v-if="icon || $slots.icon" :class="ui.icon.wrapper">
          <slot name="icon">
            <UIcon :name="(icon as string)" :class="ui.icon.base" />
          </slot>
        </div>

        <div v-else-if="headline || $slots.headline" :class="ui.headline">
          <slot name="headline">
            {{ headline }}
          </slot>
        </div>

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

        <dl v-if="align !== 'center' && features?.length" :class="[ui.features.wrapper.base, ui.features.wrapper.list]">
          <div v-for="feature in features" :key="feature.name" :class="ui.features.base">
            <dt :class="ui.features.name">
              <UIcon :name="feature.icon || ui.features.icon.name" :class="ui.features.icon.base" aria-hidden="true" />
              <span v-if="feature.name">{{ feature.name }}</span>
            </dt>
            <dd v-if="feature.description" :class="ui.features.description">
              {{ feature.description }}
            </dd>
          </div>
        </dl>

        <div v-if="align !== 'center' && (links?.length || $slots.links)" :class="ui.links">
          <slot name="links">
            <UButton v-for="(link, index) in links" :key="index" v-bind="link" @click="link.click" />
          </slot>
        </div>
      </div>

      <slot v-if="$slots[slot || 'default']" :name="slot || 'default'" />
      <div v-else-if="align === 'right'" />

      <dl v-if="align === 'center' && features?.length" :class="[ui.features.wrapper.base, ui.features.wrapper.grid]">
        <div v-for="feature in features" :key="feature.name" :class="ui.features.base">
          <dt :class="ui.features.name">
            <UIcon :name="feature.icon || ui.features.icon.name" :class="ui.features.icon.base" aria-hidden="true" />
            <span v-if="feature.name">{{ feature.name }}</span>
          </dt>
          <dd v-if="feature.description" :class="ui.features.description">
            {{ feature.description }}
          </dd>
        </div>
      </dl>

      <div v-if="align === 'center' && (links?.length || $slots.links)" :class="twMerge(ui.links, 'mt-0 justify-center')">
        <slot name="links">
          <UButton v-for="(link, index) in links" :key="index" v-bind="link" @click="link.click" />
        </slot>
      </div>
    </UContainer>

    <slot name="bottom" />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { twJoin, twMerge } from 'tailwind-merge'
import type { Button } from '#ui/types'

const appConfig = useAppConfig()

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  icon: {
    type: String,
    default: undefined
  },
  headline: {
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
  features: {
    type: Array as PropType<{
      icon?: string
      name: string
      description?: string
    }[]>,
    default: () => []
  },
  links: {
    type: Array as PropType<(Button & { click?: Function })[]>,
    default: () => []
  },
  slot: {
    type: String,
    default: undefined
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
    type: Object as PropType<Partial<typeof config.value>>,
    default: () => ({})
  }
})

const config = computed(() => {
  const container: string = twJoin(
    'gap-16 sm:gap-y-24',
    props.align === 'center' ? 'flex flex-col' : 'grid lg:grid-cols-2 lg:items-center'
  )

  const base: string = twJoin(
    '',
    props.align === 'center' && 'text-center flex flex-col items-center',
    props.align === 'right' && 'lg:order-last'
  )

  return {
    wrapper: 'py-24 sm:py-32',
    container,
    base,
    icon: {
      wrapper: 'flex mb-6',
      base: 'w-10 h-10 flex-shrink-0 text-primary'
    },
    headline: 'mb-2 text-base/7 font-semibold text-primary',
    title: 'text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl',
    description: 'mt-6 text-lg/8 text-gray-600 dark:text-gray-300',
    links: 'mt-8 flex flex-wrap gap-x-3 gap-y-1.5',
    features: {
      wrapper: {
        base: 'mt-6 leading-7',
        list: 'space-y-4',
        grid: 'grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16'
      },
      base: 'relative pl-8',
      name: 'font-semibold text-gray-900 dark:text-white',
      description: 'text-gray-500 dark:text-gray-400 leading-6',
      icon: {
        base: 'absolute left-0 top-1 h-5 w-5 text-primary',
        name: appConfig.ui.icons.check
      }
    }
  }
})

const { ui, attrs } = useUI('landing.section', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
