<template>
  <footer :class="ui.wrapper" v-bind="attrs">
    <div v-if="$slots.top" :class="ui.top.wrapper">
      <UContainer :class="ui.top.container">
        <slot name="top" />
      </UContainer>
    </div>

    <div :class="ui.bottom.wrapper">
      <UContainer :class="ui.bottom.container">
        <div :class="ui.bottom.right">
          <slot name="right" />
        </div>

        <div :class="ui.bottom.center">
          <slot name="center">
            <UFooterLinks :links="links" />
          </slot>
        </div>

        <div :class="ui.bottom.left">
          <slot name="left" />
        </div>
      </UContainer>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { FooterLink } from '#ui-pro/types'

const config = {
  wrapper: 'relative',
  top: {
    wrapper: '',
    container: 'py-8 lg:py-12'
  },
  bottom: {
    wrapper: '',
    container: 'py-8 lg:py-4 lg:flex lg:items-center lg:justify-between lg:gap-x-3',
    left: 'flex items-center justify-center lg:justify-start lg:flex-1 gap-x-1.5 mt-3 lg:mt-0 lg:order-1',
    center: 'mt-3 lg:mt-0 lg:order-2 flex items-center justify-center',
    right: 'lg:flex-1 flex items-center justify-center lg:justify-end gap-x-1.5 lg:order-3'
  }
}

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
    type: Object as PropType<Partial<typeof config>>,
    default: () => ({})
  }
})

const { ui, attrs } = useUI('footer', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
