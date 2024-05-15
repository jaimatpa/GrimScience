<template>
  <Switch v-model="isYearly" aria-label="pricing toggle" :class="ui.wrapper" v-bind="attrs">
    <span v-if="left || $slots.left" aria-hidden="true" :class="[ui.base, ui.left, isYearly ? ui.inactive : ui.active]">
      <slot name="left">
        {{ left }}
      </slot>
    </span>

    <span v-if="right || $slots.right" aria-hidden="true" :class="[ui.base, ui.right, isYearly ? ui.active : ui.inactive]">
      <slot name="right">
        {{ right }}
      </slot>
    </span>

    <span aria-hidden="true" :class="[isYearly ? 'translate-x-full' : 'translate-x-0', ui.marker]" />
  </Switch>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { Switch, provideUseId } from '@headlessui/vue'
import { useId } from '#imports'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  left: {
    type: String,
    default: 'Monthly'
  },
  right: {
    type: String,
    default: 'Yearly'
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

const emit = defineEmits(['update:modelValue'])

const config = {
  wrapper: 'ring-1 ring-gray-300 dark:ring-gray-700 flex items-center relative h-8 w-auto flex-shrink-0 cursor-pointer rounded-full p-1 w-full focus:outline-none',
  marker: 'w-1/2 text-white dark:text-gray-900 pointer-events-none inline-block h-6 transform rounded-full bg-gray-900 dark:bg-white shadow transition duration-200 ease-in-out z-0 relative',
  active: 'text-white dark:text-gray-900',
  inactive: 'text-gray-500 dark:text-gray-400',
  base: 'absolute inset-y-0 w-1/2 flex items-center justify-center pointer-events-none z-[1] transition-colors duration-200 select-none text-xs font-semibold flex-shrink-0',
  left: 'left-0',
  right: 'right-0'
}

const isYearly = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})

const { ui, attrs } = useUI('pricing.toggle', toRef(props, 'ui'), config, toRef(props, 'class'), true)

provideUseId(() => useId())
</script>
