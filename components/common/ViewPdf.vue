<script setup lang="ts">
const props = defineProps({
  url: {
    type: [String],
    required: true,
  },
});
</script>

<template>
  <div>
    <iframe  width="100%" height="1000px" :src="url"></iframe>
  </div>
</template>