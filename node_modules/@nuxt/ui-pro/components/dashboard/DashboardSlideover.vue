<template>
  <USlideover v-model="isOpen" :ui="ui" v-bind="attrs">
    <div :class="[ui.header.base, ui.header.padding]">
      <slot name="header">
        <p v-if="title || $slots.title" :class="ui.title">
          <slot name="title">
            <span class="truncate">{{ title }}</span>
          </slot>
        </p>

        <UButton v-if="closeButton" aria-label="Close" v-bind="{ ...ui.default.closeButton, ...closeButton }" @click="isOpen = false" />
      </slot>
    </div>

    <div :class="[ui.body.base, ui.body.padding]">
      <slot />
    </div>

    <div v-if="$slots.footer" :class="[ui.footer.base, ui.footer.padding]">
      <slot name="footer" />
    </div>
  </USlideover>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { slideover as slideoverConfig } from '#ui/ui.config'
import type { Button } from '#ui/types'

const appConfig = useAppConfig()

const config = computed(() => ({
  header: {
    base: 'flex items-center justify-between gap-x-1.5 flex-shrink-0 border-b border-gray-200 dark:border-gray-800 h-[--header-height]',
    padding: 'p-4'
  },
  body: {
    base: 'flex-1 overflow-y-auto',
    padding: 'p-4'
  },
  footer: {
    base: 'flex items-center gap-x-1.5 flex-shrink-0',
    padding: 'p-4'
  },
  title: 'text-gray-900 dark:text-white font-semibold flex items-center gap-x-1.5 min-w-0',
  default: {
    closeButton: {
      icon: appConfig.ui.icons.close,
      color: 'gray' as const,
      variant: 'ghost' as const,
      size: 'sm' as const
    }
  }
}))

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: undefined
  },
  closeButton: {
    type: Object as PropType<Button | null>,
    default: () => ({})
  },
  ui: {
    type: Object as PropType<Partial<typeof config.value & typeof slideoverConfig>>,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})

const { ui, attrs } = useUI('dashboard.slideover', toRef(props, 'ui'), config, undefined, true)
</script>
