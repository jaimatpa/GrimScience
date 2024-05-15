<template>
  <div
    ref="el"
    :style="{
      '--x': `${elementX}px`,
      '--y': `${elementY}px`,
    }"
    :class="[ui.wrapper, to && ui.to]"
    v-bind="attrs"
  >
    <UCard :ui="ui">
      <div :class="ui.container">
        <NuxtLink v-if="to" :aria-label="ariaLabel" v-bind="nuxtLinkBind" class="focus:outline-none" tabindex="-1">
          <span class="absolute inset-0" aria-hidden="true" />
        </NuxtLink>

        <div v-if="icon || $slots.icon" :class="ui.icon.wrapper">
          <slot name="icon">
            <UIcon :name="(icon as string)" :class="ui.icon.base" />
          </slot>
        </div>

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

        <slot name="container" />
      </div>

      <slot v-if="$slots.default" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { twJoin } from 'tailwind-merge'
import { nuxtLinkProps, getNuxtLinkProps } from '#ui/utils'
import { getSlotChildrenText } from '../../lib/slots'
import colors from '#tailwind-config/theme/colors'
import uiColors from '#ui-colors'
import { card as cardConfig } from '#ui/ui.config'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  ...nuxtLinkProps,
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
  color: {
    type: String as PropType<typeof uiColors[number]>,
    default: 'primary'
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
    type: Object as PropType<Partial<typeof config.value & typeof cardConfig>>,
    default: () => ({})
  }
})

const colorLight = computed(() => {
  if (props.color === 'primary') {
    return 'rgb(var(--color-primary-DEFAULT))'
  }
  // @ts-ignore
  return colors[props.color]?.['500'] || colors[props.color] || props.color
})
const colorDark = computed(() => {
  if (props.color === 'primary') {
    return 'rgb(var(--color-primary-DEFAULT))'
  }
  // @ts-ignore
  return colors[props.color]?.['400'] || colors[props.color] || props.color
})

const config = computed(() => {
  const base = twJoin(
    'gap-x-8 gap-y-4 rounded-xl flex-1',
    props.orientation === 'vertical' && 'flex flex-col',
    !!slots.default && props.orientation === 'horizontal' && 'grid lg:grid-cols-2 lg:items-center'
  )

  return {
    wrapper: 'relative group isolate rounded-xl background-gradient ring-1 ring-gray-200 dark:ring-gray-800 before:hidden before:lg:block before:absolute before:-inset-[2px] before:h-[calc(100%+4px)] before:w-[calc(100%+4px)] before:z-[-1] before:rounded-[13px] flex-1 flex flex-col shadow',
    to: 'hover:ring-primary-500 dark:hover:ring-primary-400 transition-shadow duration-200',
    base: 'flex-1 flex flex-col overflow-hidden',
    container: '',
    body: {
      base
    },
    background: 'bg-white dark:bg-gray-900 hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-[background-opacity]',
    ring: '',
    rounded: 'rounded-xl',
    shadow: '',
    icon: {
      wrapper: 'mb-2 pointer-events-none',
      base: 'w-8 h-8 flex-shrink-0 text-gray-900 dark:text-white'
    },
    title: 'text-gray-900 dark:text-white text-base font-bold truncate',
    description: 'text-[15px] text-gray-500 dark:text-gray-400 mt-1'
  }
})

const el = ref<HTMLDivElement>()

const slots = useSlots()
const { elementX, elementY } = useSharedMouseInElement(el)
const { ui, attrs } = useUI('landing.card', toRef(props, 'ui'), config, toRef(props, 'class'), true)

const nuxtLinkBind = computed(() => getNuxtLinkProps(props))
const ariaLabel = computed(() => (props.title || (slots.title && getSlotChildrenText(slots.title())) || 'Card link').trim())
</script>

<style scoped>
.background-gradient::before {
  background: radial-gradient(
    250px circle at var(--x) var(--y),
    v-bind(colorLight) 0%,
    transparent 100%
  );
  will-change: background;
}

.dark {
  .background-gradient::before {
    background: radial-gradient(
      250px circle at var(--x) var(--y),
      v-bind(colorDark) 0%,
      transparent 100%
    );
  }
}
</style>
