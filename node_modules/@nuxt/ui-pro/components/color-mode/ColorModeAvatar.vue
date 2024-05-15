<template>
  <UAvatar :src="light" class="dark:hidden" v-bind="$attrs" />
  <UAvatar :src="dark" class="hidden dark:block" v-bind="$attrs" />
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

defineProps({
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
