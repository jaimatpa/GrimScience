<template>
  <component :is="as" :src="light" class="dark:hidden" v-bind="$attrs" />
  <component :is="as" :src="dark" class="hidden dark:block" v-bind="$attrs" />
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

defineProps({
  as: {
    type: [String, Object],
    default: 'img'
  },
  dark: {
    type: String,
    required: true
  },
  light: {
    type: String,
    required: true
  }
})
</script>
