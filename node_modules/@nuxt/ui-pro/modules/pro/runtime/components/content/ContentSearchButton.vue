<template>
  <UButton
    :icon="appConfig.ui.icons.search"
    :label="label"
    truncate
    v-bind="((!!label ? $ui?.button?.input : $ui?.button?.secondary) as any)"
    aria-label="Search"
    :class="[!!label && 'flex-1']"
    @click="toggleContentSearch"
  >
    <template v-if="!!label" #trailing>
      <div class="hidden lg:flex items-center gap-0.5 ml-auto -my-1 flex-shrink-0">
        <UKbd>
          {{ metaSymbol }}
        </UKbd>
        <UKbd>
          K
        </UKbd>
      </div>
    </template>
  </UButton>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()
const { toggleContentSearch } = useUIState()
const { metaSymbol } = useShortcuts()

defineProps({
  label: {
    type: String,
    default: 'Search...'
  }
})
</script>
