<template>
  <header :class="ui.wrapper" v-bind="attrs">
    <slot name="top" />

    <UContainer :class="ui.container">
      <div :class="ui.left">
        <slot name="left">
          <NuxtLink :to="to" :aria-label="ariaLabel" :class="ui.logo">
            <slot name="logo">
              {{ title || 'Nuxt UI Pro' }}
            </slot>
          </NuxtLink>
        </slot>
      </div>

      <slot name="center">
        <UHeaderLinks :links="links" :class="ui.center" />
      </slot>

      <div :class="ui.right">
        <slot name="right" />

        <slot name="panel-button" :open="isHeaderDialogOpen">
          <UButton
            v-if="links.length || $slots.panel"
            :class="ui.button.base"
            v-bind="($ui?.button?.secondary as any)"
            :aria-label="`${isHeaderDialogOpen ? 'Close' : 'Open'} Menu`"
            :icon="isHeaderDialogOpen ? ui.button.icon.close : ui.button.icon.open"
            @click="isHeaderDialogOpen = !isHeaderDialogOpen"
          />
        </slot>
      </div>
    </UContainer>

    <slot name="bottom" />

    <TransitionRoot :show="isHeaderDialogOpen" as="template">
      <Dialog as="div" @close="isHeaderDialogOpen = false">
        <DialogPanel :class="ui.panel.wrapper">
          <div :class="[ui.panel.header, ui.wrapper]">
            <div :class="ui.container">
              <div :class="ui.left">
                <slot name="left">
                  <NuxtLink :to="to" :aria-label="ariaLabel" :class="ui.logo">
                    <slot name="logo">
                      {{ title || 'Nuxt UI Pro' }}
                    </slot>
                  </NuxtLink>
                </slot>
              </div>

              <slot name="center" />

              <div :class="ui.right">
                <slot name="right" />

                <slot name="panel-button" :open="isHeaderDialogOpen">
                  <UButton
                    :class="ui.button.base"
                    v-bind="($ui?.button?.secondary as any)"
                    :aria-label="`${isHeaderDialogOpen ? 'Close' : 'Open'} Menu`"
                    :icon="isHeaderDialogOpen ? ui.button.icon.close : ui.button.icon.open"
                    @click="isHeaderDialogOpen = !isHeaderDialogOpen"
                  />
                </slot>
              </div>
            </div>
          </div>
          <div :class="ui.panel.body">
            <slot name="panel">
              <UAsideLinks :links="links" />
            </slot>
          </div>
        </DialogPanel>
      </Dialog>
    </TransitionRoot>
  </header>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, provideUseId } from '@headlessui/vue'
import { getSlotChildrenText } from '../../lib/slots'
import type { HeaderLink } from '#ui-pro/types'
import { useId } from '#imports'

const appConfig = useAppConfig()

const config = computed(() => ({
  wrapper: 'bg-background/75 backdrop-blur border-b border-gray-200 dark:border-gray-800 -mb-px sticky top-0 z-50',
  container: 'flex items-center justify-between gap-3 h-[--header-height]',
  left: 'lg:flex-1 flex items-center gap-1.5',
  center: 'hidden lg:flex',
  right: 'flex items-center justify-end lg:flex-1 gap-1.5',
  logo: 'flex-shrink-0 font-bold text-xl text-gray-900 dark:text-white flex items-end gap-1.5',
  panel: {
    wrapper: 'fixed inset-0 z-50 overflow-y-auto bg-background lg:hidden',
    header: 'px-4 sm:px-6',
    body: 'px-4 sm:px-6 pt-3 pb-6'
  },
  button: {
    base: 'lg:hidden',
    icon: {
      open: appConfig.ui.icons.menu,
      close: appConfig.ui.icons.close
    }
  }
}))

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  to: {
    type: String,
    default: '/'
  },
  title: {
    type: String,
    default: undefined
  },
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

const route = useRoute()
const slots = useSlots()
const { isHeaderDialogOpen } = useUIState()
const { ui, attrs } = useUI('header', toRef(props, 'ui'), config, toRef(props, 'class'), true)

const ariaLabel = computed(() => (props.title || (slots.logo && getSlotChildrenText(slots.logo())) || 'Logo').trim())

watch(() => route.fullPath, () => {
  isHeaderDialogOpen.value = false
})

provideUseId(() => useId())
</script>
