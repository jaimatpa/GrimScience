<script setup lang="ts">
const props = defineProps({
  name: {
    type: String
  },
  message: {
    type: String
  },
  label: {
    type: String
  },
  to: {
    type: String
  }
})
</script>

<template>
  <UPageError :name="props.name" :message="props.message" :clear-button="{
    label: props.label || 'Go Back',
    to: props.to
  }" />
</template>
