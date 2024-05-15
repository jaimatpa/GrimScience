<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UToggle
      v-bind="$attrs"
      v-model="isDark"
      :on-icon="appConfig.ui.icons.dark"
      :off-icon="appConfig.ui.icons.light"
      :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
    />

    <template #fallback>
      <UToggle
        v-bind="$attrs"
        :on-icon="appConfig.ui.icons.dark"
        :off-icon="appConfig.ui.icons.light"
        :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
        disabled
      />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

const colorMode = useColorMode()
const appConfig = useAppConfig()

// Computed

const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>
