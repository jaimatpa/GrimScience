<script setup lang="ts">
const emit = defineEmits(['handleSortingButton', 'handleInputChange'])
const props = defineProps({
  sortKey: {
    type: [String],
    required: true
  }, 
  sortLabel: {
    type: [String],
    required: true
  }, 
  sortIcon: {
    type: [String],
    required: true
  },
  filterKey: {
    type: [String],
    required: true
  }
})
</script>
<template>
  <div>
    <UButton variant="ghost" color="gray" @click="emit('handleSortingButton', props.sortKey)">
      {{ props.sortLabel }}
      <template #trailing>
        <UIcon 
          :name="props.sortIcon" 
          class="w-5 h-5" 
        />
      </template>
    </UButton>
  </div>
  <div>
    <UInput
      @change="event => emit('handleInputChange', event, props.filterKey)"
    />
  </div>
</template>