<template>
  <ClientOnly v-if="!colorMode?.forced">
    <USelectMenu v-bind="$attrs" v-model="preference" :leading-icon="preference.icon" :options="options">
      <template #label>
        <span class="truncate">{{ preference.label }}</span>
      </template>
    </USelectMenu>

    <template #fallback>
      <USelectMenu v-bind="$attrs" :model-value="options[0]" :leading-icon="options[0].icon" disabled />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

const colorMode = useColorMode()
const appConfig = useAppConfig()

const options = computed(() => [
  { label: 'System', value: 'system', icon: appConfig.ui.icons.system },
  { label: 'Light', value: 'light', icon: appConfig.ui.icons.light },
  { label: 'Dark', value: 'dark', icon: appConfig.ui.icons.dark }
])

const preference = computed({
  get () {
    return options.value.find(option => option.value === colorMode.preference) || options.value[0]
  },
  set (option) {
    colorMode.preference = option!.value
  }
})
</script>
