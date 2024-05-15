<template>
  <div v-bind="attrs" :class="ui.wrapper">
    <div :class="ui.container" />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { twJoin } from 'tailwind-merge'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  orientation: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'vertical'
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

const config = computed(() => {
  const wrapper: string = twJoin(
    'hidden md:block bg-transparent select-none absolute z-50 group',
    props.orientation === 'vertical' && 'w-[9px] h-full inset-y-0 -right-[5px] cursor-col-resize',
    props.orientation === 'horizontal' && 'h-[9px] w-full inset-x-0 -top-[5px] cursor-row-resize'
  )

  const container: string = twJoin(
    'group-hover:bg-gray-300 dark:group-hover:bg-gray-700 transition duration-200 absolute',
    props.orientation === 'vertical' && 'w-px h-full inset-x-0 mx-auto',
    props.orientation === 'horizontal' && 'h-px w-full inset-y-0 my-auto'
  )

  return {
    wrapper,
    container
  }
})

const { ui, attrs } = useUI('dashboard.panel.handle', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
