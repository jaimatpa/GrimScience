<template>
  <ul v-if="links?.length" :class="ui.wrapper" v-bind="attrs">
    <li v-for="(link, index) of links" :key="index" class="relative">
      <ULink
        v-bind="getULinkProps(link)"
        :class="ui.base"
        :active-class="ui.active"
        :inactive-class="ui.inactive"
        @click="link.click"
      >
        {{ link.label }}

        <UIcon v-if="link.target === '_blank'" :name="ui.externalIcon.name" :class="ui.externalIcon.base" />
      </ULink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { getULinkProps } from '#ui/utils'
import type { FooterLink } from '#ui-pro/types'

const appConfig = useAppConfig()

const config = computed(() => ({
  wrapper: 'flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-6',
  base: 'text-sm',
  active: 'text-gray-900 dark:text-white font-medium',
  inactive: 'text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
  externalIcon: {
    name: appConfig.ui.icons.external,
    base: 'w-3 h-3 absolute top-0.5 -right-3.5 text-gray-400 dark:text-gray-500'
  }
}))

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  links: {
    type: Array as PropType<FooterLink[]>,
    default: () => []
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

const { ui, attrs } = useUI('footer.links', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
