<template>
  <UModal v-model="isOpen" :overlay="!smallerThanSm" :transition="!smallerThanSm" :ui="ui">
    <UCommandPalette
      ref="commandPaletteRef"
      :model-value="[]"
      :groups="groups"
      :ui="ui.commandPalette"
      :close-button="ui.default.closeButton"
      :fuse="fuse"
      multiple
      v-bind="attrs"
      @update:model-value="onSelect"
      @close="isOpen = false"
    >
      <template v-for="(_, name) in $slots" #[name]="slotData: any">
        <slot :name="name" v-bind="slotData" />
      </template>
    </UCommandPalette>
  </UModal>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { defu } from 'defu'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import type { Group, Command } from '#ui/types'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'

defineOptions({
  inheritAttrs: false
})

const appConfig = useAppConfig()

const config = computed(() => ({
  padding: 'p-0 sm:p-4',
  rounded: 'rounded-none sm:rounded-lg',
  width: 'sm:max-w-3xl',
  height: 'h-dvh sm:h-[28rem]',
  commandPalette: {
    input: {
      height: 'h-[--header-height] sm:h-12',
      icon: {
        size: 'h-5 w-5',
        padding: 'ps-11'
      }
    },
    group: {
      command: {
        // eslint-disable-next-line quotes
        prefix: `!text-foreground after:content-['_>']`
      }
    },
    container: 'scroll-py-10'
  },
  fileIcon: {
    name: 'i-heroicons-document-text'
  },
  default: {
    closeButton: {
      icon: appConfig.ui.icons.close,
      color: 'gray' as const,
      variant: 'ghost' as const,
      size: 'sm' as const
    }
  }
}))

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: undefined
  },
  groups: {
    type: Array as PropType<Group[]>,
    default: () => []
  },
  fuse: {
    type: Object as PropType<UseFuseOptions<Command>>,
    default: () => ({})
  },
  hideColorMode: {
    type: Boolean,
    default: false
  },
  ui: {
    type: Object as PropType<Partial<typeof config.value>>,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const { usingInput } = useShortcuts()
const { isDashboardSearchModalOpen } = useUIState()
const breakpoints = useBreakpoints(breakpointsTailwind)
const colorMode = useColorMode()
const { ui, attrs } = useUI('dashboard.search', toRef(props, 'ui'), config, undefined, true)

const smallerThanSm = breakpoints.smaller('sm')

const commandPaletteRef = ref<HTMLElement & { query: Ref<string>, results: { item: Command }[] }>()

// Computed

const isOpen = computed({
  get () {
    return props.modelValue !== undefined ? props.modelValue : isDashboardSearchModalOpen.value
  },
  set (value) {
    props.modelValue !== undefined ? emit('update:modelValue', value) : (isDashboardSearchModalOpen.value = value)
  }
})

const fuse: ComputedRef<Partial<UseFuseOptions<Command>>> = computed(() => defu({}, props.fuse, {
  fuseOptions: {
    ignoreLocation: true,
    includeMatches: true,
    threshold: 0.1,
    keys: [
      { name: 'title', weight: 5 },
      { name: 'label', weight: 5 },
      { name: 'suffix', weight: 3 }
    ]
  },
  resultLimit: 12
}))

const groups = computed(() => {
  return [...(props.groups || []), !colorMode?.forced && !props.hideColorMode && {
    key: 'theme',
    label: 'Theme',
    commands: [{
      id: 'theme-light',
      label: 'Light',
      icon: appConfig.ui.icons.light,
      disabled: colorMode.preference === 'light',
      click: () => {
        colorMode.preference = 'light'
      }
    }, {
      id: 'theme-dark',
      label: 'Dark',
      icon: appConfig.ui.icons.dark,
      disabled: colorMode.preference === 'dark',
      click: () => {
        colorMode.preference = 'dark'
      }
    }]
  }].filter(Boolean) as Group[]
})

// avoid conflicts between multiple meta_k shortcuts
const canToggleModal = computed(() => isOpen.value || !usingInput.value)

// Methods

function onSelect (options: Command[]) {
  isOpen.value = false

  const option = options[0]
  if (!option) {
    return
  }

  if (option.click) {
    option.click()
  } else if (option.to) {
    if (option.target === '_blank' || option.to.startsWith('http')) {
      window.open(option.to, option.target || '_blank')
    } else {
      router.push(option.to)
    }
  } else if (option.href) {
    window.open(option.href, '_blank')
  }
}

// Shortcuts

defineShortcuts({
  meta_k: {
    usingInput: true,
    whenever: [canToggleModal],
    handler: () => {
      isOpen.value = !isOpen.value
    }
  },
  escape: {
    usingInput: true,
    whenever: [isOpen],
    handler: () => { isOpen.value = false }
  }
})

// Expose

defineExpose({
  commandPaletteRef
})
</script>
