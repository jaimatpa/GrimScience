<template>
  <UAccordion
    :key="route.path"
    :items="(items as AccordionItem[])"
    :multiple="multiple"
    :ui="ui"
    v-bind="attrs"
  >
    <template #default="{ item, open }">
      <ULink
        :class="[ui.button.base, level > 0 && ui.button.level]"
        :active-class="ui.button.active"
        :inactive-class="ui.button.inactive"
      >
        <UIcon v-if="item.icon" :name="item.icon" :class="ui.button.icon.base" />

        <span :class="ui.button.label">{{ item.label }}</span>

        <UIcon
          v-if="!item.disabled"
          :name="ui.button.trailingIcon.name"
          :class="[ui.button.trailingIcon.base, open ? ui.button.trailingIcon.active : ui.button.trailingIcon.inactive]"
        />
      </ULink>
    </template>

    <template v-for="({ label }, index) in links" :key="index" #[label.toLowerCase()]="{ item }">
      <UNavigationTree
        :links="item.children"
        :level="level + 1"
        :default-open="defaultOpen"
        :multiple="multiple"
        :class="ui.tree"
        :ui="{ links: ui.links }"
      />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { twJoin } from 'tailwind-merge'
import type { AccordionItem } from '#ui/types'
import type { NavigationTree } from '#ui-pro/types'
import { accordion as accordionConfig } from '#ui/ui.config'

const appConfig = useAppConfig()

const config = computed(() => {
  const wrapper: string = twJoin(
    'space-y-3',
    props.level > 0 && 'border-l border-gray-200 dark:border-gray-800 -ml-px hover:border-gray-300 dark:hover:border-gray-700'
  )

  const tree: string = twJoin(
    'border-l border-gray-200 dark:border-gray-800',
    props.level > 0 ? 'ml-6' : 'ml-2.5'
  )

  return {
    wrapper,
    container: 'space-y-3',
    item: {
      padding: '',
      color: 'text-inherit dark:text-inherit'
    },
    button: {
      base: 'flex items-center gap-1.5 group w-full focus-visible:outline-primary',
      active: 'text-primary border-current',
      inactive: 'border-transparent',
      level: 'border-l -ml-px pl-3.5',
      icon: {
        base: 'w-5 h-5 flex-shrink-0'
      },
      trailingIcon: {
        name: appConfig.ui.icons.chevron,
        base: 'w-5 h-5 ms-auto transform transition-transform duration-200 flex-shrink-0 mr-1.5',
        active: 'text-gray-700 dark:text-gray-200',
        inactive: 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 -rotate-90'
      },
      label: 'text-sm/6 font-semibold truncate'
    },
    tree,
    links: {}
  }
})

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  level: {
    type: Number,
    default: 0
  },
  links: {
    type: Array as PropType<NavigationTree[]>,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: true
  },
  defaultOpen: {
    type: [Boolean, Number],
    default: undefined
  },
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  },
  ui: {
    type: Object as PropType<Partial<typeof config.value & typeof accordionConfig>>,
    default: () => ({})
  }
})

const route = useRoute()
const { ui, attrs } = useUI('navigation.accordion', toRef(props, 'ui'), config, toRef(props, 'class'), true)

// Computed

const items = computed(() => props.links?.map(link => {
  const defaultOpen = !props.defaultOpen || (typeof props.defaultOpen === 'number' && props.level < props.defaultOpen) || (link.to && route.path.startsWith(link.to.toString()))

  return {
    label: link.label,
    icon: link.icon,
    slot: link.label.toLowerCase(),
    disabled: link.disabled,
    defaultOpen,
    children: link.children
  }
}))
</script>
