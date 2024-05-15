<template>
  <UCard :class="[ui.wrapper, to && ui.to]" v-bind="attrs" :ui="ui" :style="{ '--color-light': colorLight, '--color-dark': colorDark }">
    <NuxtLink v-if="to" :to="to" :target="target" class="focus:outline-none" tabindex="-1">
      <span class="absolute inset-0" aria-hidden="true" />
    </NuxtLink>

    <UIcon v-if="icon" :name="icon" :class="ui.icon.base" />

    <UIcon v-if="!!to && target === '_blank'" :name="ui.externalIcon.name" :class="ui.externalIcon.base" />

    <p :class="ui.title">
      {{ title }}
    </p>

    <p v-if="$slots.default" :class="ui.description">
      <ContentSlot unwrap="p" :use="$slots.default" />
    </p>
  </UCard>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import colors from '#tailwind-config/theme/colors'
import uiColors from '#ui-colors'

const appConfig = useAppConfig()

const config = computed(() => ({
  wrapper: 'relative group overflow-hidden flex items-center rounded-lg',
  to: 'hover:ring-1 hover:ring-[--color-light] dark:hover:ring-[--color-dark] hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
  icon: {
    base: 'w-6 h-6 mb-4 inline-flex items-center text-[--color-light] dark:text-[--color-dark] pointer-events-none'
  },
  body: {
    base: 'flex-1'
  },
  externalIcon: {
    name: appConfig.ui.icons.external,
    base: 'w-4 h-4 absolute right-2 top-2 text-gray-400 dark:text-gray-500 group-hover:text-[--color-light] dark:group-hover:text-[--color-dark]'
  },
  title: 'text-gray-900 dark:text-white font-semibold text-base my-0',
  description: 'text-[15px] text-gray-500 dark:text-gray-400 mt-1 mb-0'
}))

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  icon: {
    type: String,
    default: undefined
  },
  color: {
    type: String as PropType<typeof uiColors[number]>,
    default: 'primary'
  },
  to: {
    type: String,
    default: undefined
  },
  target: {
    type: String,
    default: undefined
  },
  title: {
    type: String,
    default: undefined
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

const { ui, attrs } = useUI('content.card', toRef(props, 'ui'), config, toRef(props, 'class'), true)

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

const target = computed(() => props.target || (props.to && props.to.startsWith('http') ? '_blank' : undefined))
</script>
