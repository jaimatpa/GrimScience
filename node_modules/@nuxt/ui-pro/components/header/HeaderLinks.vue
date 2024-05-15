<template>
  <ul v-if="links?.length" :class="ui.wrapper" v-bind="attrs">
    <li v-for="(link, index) of links" :key="index" class="relative">
      <UPopover v-if="link.children?.length" v-bind="ui.default.popover">
        <template #default="{ open }">
          <ULink
            v-bind="getULinkProps(link)"
            :class="ui.base"
            :active-class="ui.active"
            :inactive-class="ui.inactive"
            @click="link.click"
          >
            <slot name="label" :link="link">
              {{ link.label }}
            </slot>

            <UIcon :name="ui.trailingIcon.name" :class="[ui.trailingIcon.base, open ? ui.trailingIcon.active : ui.trailingIcon.inactive]" />
          </ULink>
        </template>

        <template #panel="{ close }">
          <slot name="panel" :link="link" :close="close">
            <UHeaderPopoverLinks :links="link.children" @click="close" />
          </slot>
        </template>
      </UPopover>
      <ULink
        v-else
        v-bind="getULinkProps(link)"
        :class="ui.base"
        :active-class="ui.active"
        :inactive-class="ui.inactive"
        @click="link.click"
      >
        <slot name="label" :link="link">
          {{ link.label }}
        </slot>

        <UIcon v-if="link.target === '_blank'" :name="ui.externalIcon.name" :class="ui.externalIcon.base" />
      </ULink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { getULinkProps } from '#ui/utils'
import type { HeaderLink } from '#ui-pro/types'

const appConfig = useAppConfig()

const config = computed(() => ({
  wrapper: 'flex items-center gap-x-8',
  base: 'text-sm/6 font-semibold flex items-center gap-1',
  active: 'text-primary',
  inactive: 'hover:text-primary',
  trailingIcon: {
    name: appConfig.ui.icons.chevron,
    base: 'w-5 h-5 transform transition-transform duration-200 flex-shrink-0',
    active: 'rotate-180',
    inactive: ''
  },
  externalIcon: {
    name: appConfig.ui.icons.external,
    base: 'w-3 h-3 absolute top-0.5 -right-3.5 text-gray-400 dark:text-gray-500'
  },
  default: {
    popover: {
      mode: 'hover' as const,
      openDelay: 0,
      ui: {
        width: 'max-w-[16rem]'
      }
    }
  }
}))

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  links: {
    type: Array as PropType<HeaderLink[]>,
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

const { ui, attrs } = useUI('header.links', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
