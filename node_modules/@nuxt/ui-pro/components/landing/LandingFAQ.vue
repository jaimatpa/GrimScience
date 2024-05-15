<template>
  <UAccordion :class="ui.wrapper" :items="items" :multiple="multiple" v-bind="attrs" :ui="{ item: ui.item, container: ui.container }">
    <template #default="{ item, open }">
      <UButton
        color="gray"
        variant="link"
        :ui="{ rounded: 'rounded-none', color: { gray: { link: 'hover:no-underline' } } }"
        :padded="false"
        :class="ui.button.base"
      >
        <span :class="ui.button.label">{{ item.label }}</span>

        <template #trailing>
          <UIcon
            :name="ui.button.trailingIcon.name"
            :class="[ui.button.trailingIcon.base, open ? ui.button.trailingIcon.active : ui.button.trailingIcon.inactive]"
          />
        </template>
      </UButton>
    </template>

    <template #item="scope">
      <slot name="item" v-bind="scope" />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { AccordionItem } from '#ui/types'

const appConfig = useAppConfig()

const config = computed(() => ({
  wrapper: 'divide-y divide-gray-200 dark:divide-gray-800 -mt-6',
  container: 'divide-y divide-gray-200 dark:divide-gray-800',
  item: {
    size: 'text-base',
    padding: 'py-6'
  },
  button: {
    base: 'text-left text-lg py-6 w-full',
    label: 'text-gray-900 dark:text-white',
    trailingIcon: {
      name: appConfig.ui.icons.chevron,
      base: 'w-5 h-5 ms-auto transform transition-transform duration-200 flex-shrink-0 mr-1.5',
      active: '',
      inactive: '-rotate-90'
    }
  }
}))

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  items: {
    type: Array as PropType<AccordionItem[]>,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
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

const { ui, attrs } = useUI('landing.faq', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
