<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <div v-if="$slots.left" :class="ui.left">
      <slot name="left" />
    </div>

    <div :class="ui.center">
      <div v-for="(link, index) in links" :key="index">
        <h3 :class="ui.label">
          {{ link.label }}
        </h3>

        <ul role="list" :class="ui.list">
          <li v-for="(subLink, subIndex) of link.children" :key="subIndex">
            <ULink
              v-bind="getULinkProps(subLink)"
              :class="ui.base"
              :active-class="ui.active"
              :inactive-class="ui.inactive"
              @click="subLink.click"
            >
              {{ subLink.label }}

              <UIcon v-if="subLink.target === '_blank'" :name="ui.externalIcon.name" :class="ui.externalIcon.base" />
            </ULink>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="$slots.right" :class="ui.right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { getULinkProps } from '#ui/utils'
import type { FooterLink } from '#ui-pro/types'

const appConfig = useAppConfig()

const config = computed(() => ({
  wrapper: 'xl:grid xl:grid-cols-3 xl:gap-8',
  left: 'mb-10 xl:mb-0',
  center: 'flex flex-col lg:grid grid-flow-col auto-cols-fr gap-8 xl:col-span-2',
  right: 'mt-10 xl:mt-0',
  label: 'text-sm/6 font-semibold text-gray-900 dark:text-white',
  list: 'mt-6 space-y-4',
  base: 'text-sm relative',
  active: 'text-gray-900 dark:text-white font-medium',
  inactive: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
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
    type: Array as PropType<{ label: string, children: FooterLink[] }[]>,
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

const { ui, attrs } = useUI('footer.columns', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
