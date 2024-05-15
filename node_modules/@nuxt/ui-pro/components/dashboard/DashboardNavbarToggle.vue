<template>
  <UButton
    v-if="isOpen !== undefined"
    :icon="appConfig.ui.icons.menu"
    v-bind="($ui?.button?.secondary as any)"
    :aria-label="`${isOpen ? 'Close' : 'Open'} sidebar`"
    class="lg:hidden"
    @click="isOpen = !isOpen"
  />
</template>

<script setup lang="ts">
const appConfig = useAppConfig()

const isOpen = inject<boolean | undefined>('isOpen', undefined)
</script>
