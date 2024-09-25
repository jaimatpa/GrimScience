<script setup lang="ts">
const props = defineProps({
  purchase: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div class="flex items-center gap-2 justify-between">
    <p>PO# :</p>
    <p>{{ purchase?.UniqueId }}</p>
  </div>
  <div class="flex items-center gap-2 justify-between">
    <p>Date :</p>
    <p>{{ purchase?.date }}</p>
  </div>
  <div class="flex items-center gap-2 justify-between">
    <p>Ship To :</p>
    <p>707 Gilman Avenue</p>
  </div>
  <UCheckbox name="is_order_closed" label="Order Closed" />
</template>
