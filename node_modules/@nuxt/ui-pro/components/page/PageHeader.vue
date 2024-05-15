<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <div v-if="headline || $slots.headline" :class="ui.headline">
      <slot name="headline">
        {{ headline }}
      </slot>
    </div>

    <div class="flex flex-col lg:flex-row items-start gap-6">
      <div v-if="icon || $slots.icon" :class="ui.icon.wrapper">
        <slot name="icon">
          <UIcon :name="(icon as string)" :class="ui.icon.base" />
        </slot>
      </div>

      <div class="flex-1">
        <div :class="ui.container">
          <h1 :class="ui.title">
            <slot name="title">
              {{ title }}
            </slot>
          </h1>

          <div v-if="links?.length || $slots.links" :class="ui.links">
            <slot name="links">
              <UButton
                v-for="(link, index) of links"
                :key="index"
                v-bind="{ ...link, target: link.target || '_blank', color: link.color || 'white' }"
                @click="link.click"
              />
            </slot>
          </div>
        </div>

        <p v-if="description || $slots.description" :class="ui.description">
          <slot name="description">
            {{ description }}
          </slot>
        </p>

        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Button } from '#ui/types'

const config = {
  wrapper: 'relative border-b border-gray-200 dark:border-gray-800 py-8',
  container: 'flex flex-col lg:flex-row lg:items-center lg:justify-between',
  headline: 'mb-3 text-sm/6 font-semibold text-primary flex items-center gap-1.5',
  title: 'text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight',
  description: 'mt-4 text-lg text-gray-500 dark:text-gray-400',
  icon: {
    wrapper: 'flex',
    base: 'w-10 h-10 flex-shrink-0 text-primary'
  },
  links: 'flex flex-wrap items-center gap-1.5 mt-4 lg:mt-0'
}

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
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
  icon: {
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
    type: Object as PropType<Partial<typeof config>>,
    default: () => ({})
  }
})

const { ui, attrs } = useUI('page.header', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
