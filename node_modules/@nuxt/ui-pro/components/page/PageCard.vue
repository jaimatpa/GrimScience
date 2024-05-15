<template>
  <UCard :class="[ui.wrapper, to && ui.to]" v-bind="attrs" :ui="ui">
    <NuxtLink v-if="to" :aria-label="ariaLabel" v-bind="nuxtLinkBind" class="focus:outline-none" tabindex="-1">
      <span class="absolute inset-0" aria-hidden="true" />
    </NuxtLink>

    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

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

    <slot />

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { nuxtLinkProps, getNuxtLinkProps } from '#ui/utils'
import { getSlotChildrenText } from '../../lib/slots'
import { card as cardConfig } from '#ui/ui.config'

const config = {
  wrapper: 'relative group',
  to: 'hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
  icon: {
    wrapper: 'mb-6 flex',
    base: 'w-10 h-10 flex-shrink-0 text-primary'
  },
  body: {
    base: 'flex-1'
  },
  title: 'text-gray-900 dark:text-white text-base font-semibold truncate flex items-center gap-1.5',
  description: 'text-[15px] text-gray-500 dark:text-gray-400 mt-1'
}


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
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  },
  ui: {
    type: Object as PropType<Partial<typeof config & typeof cardConfig>>,
    default: () => ({})
  }
})

const slots = useSlots()
const { ui, attrs } = useUI('page.card', toRef(props, 'ui'), config, toRef(props, 'class'), true)

const nuxtLinkBind = computed(() => getNuxtLinkProps(props))
const ariaLabel = computed(() => (props.title || (slots.title && getSlotChildrenText(slots.title())) || 'Card link').trim())
</script>
