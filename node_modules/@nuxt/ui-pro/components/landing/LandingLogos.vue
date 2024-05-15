<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <h2 v-if="title" :class="ui.title">
      {{ title }}
    </h2>
    <div :class="ui.images">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  title: {
    type: String,
    default: undefined
  },
  align: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'center'
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
  const wrapper: string = ({
    center: 'text-center',
    right: 'text-right',
    left: 'text-left'
  })[props.align]

  return {
    wrapper,
    title: 'text-lg font-semibold leading-8 text-gray-900 dark:text-white',
    images: 'mx-auto mt-10 flex flex-wrap items-center justify-between gap-8'
  }
})

const { ui, attrs } = useUI('landing.logos', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
