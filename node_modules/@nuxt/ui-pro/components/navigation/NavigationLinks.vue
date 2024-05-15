<template>
  <div v-if="links?.length" :class="level > 0 ? ui.wrapperLevel : ui.wrapper" v-bind="attrs">
    <ULink
      v-for="(link, index) in links"
      :key="index"
      v-bind="getULinkProps(link)"
      :class="[ui.base, level > 0 && ui.level]"
      :active-class="ui.active"
      :inactive-class="ui.inactive"
      @click="link.click"
    >
      <UIcon v-if="link.icon" :name="link.icon" :class="twMerge(ui.icon.base, link.iconClass)" />

      <span :class="ui.label">{{ link.label }}</span>

      <slot name="badge" :link="link">
        <UBadge v-if="link.badge" v-bind="typeof link.badge === 'string' ? { size: 'xs', variant: 'subtle', label: link.badge } : { size: 'xs', variant: 'subtle', ...link.badge }" :class="ui.badge.base" />
      </slot>
    </ULink>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { twMerge } from 'tailwind-merge'
import { getULinkProps } from '#ui/utils'
import type { NavigationLink } from '#ui-pro/types'

const config = {
  wrapper: 'space-y-3',
  wrapperLevel: 'space-y-1.5',
  base: 'flex items-center gap-1.5 group',
  active: 'text-primary font-medium border-current',
  inactive: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-transparent hover:border-gray-500 dark:hover:border-gray-400',
  level: 'border-l -ml-px pl-4',
  icon: {
    base: 'w-5 h-5 flex-shrink-0'
  },
  badge: {
    base: 'rounded-full'
  },
  label: 'text-sm/6 truncate'
}

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  level: {
    type: Number,
    default: 0
  },
  links: {
    type: Array as PropType<NavigationLink[]>,
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

const { ui, attrs } = useUI('navigation.links', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
