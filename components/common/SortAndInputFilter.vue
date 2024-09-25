<script setup lang="ts">
const emit = defineEmits(['handleSortingButton', 'handleInputChange'])
const props = defineProps({
  label: {
    type: [String],
    required: true
  }, 
  sortable: {
    type: [Boolean, null]
  }, 
  sortKey: {
    type: [String],
  }, 
  sortIcon: {
    type: [String]
  }, 
  value: {
    type: [String, Number, null]
  },
  filterable: {
    type: [Boolean, null]
  }, 
  filterKey: {
    type: [String]
  }
})
</script>
<template>
  <template v-if="props.filterable">
    <div class="flex justify-center">
      <UInput
        :model-value="props.value"
        @update:model-value="event => emit('handleInputChange', event, props.filterKey)"
        :ui="{wrapper: 'w-full', base: 'w-full'}"
      />
    </div>
  </template>
  <template v-if="props.sortable">
    <div class="flex justify-start align-sortable">
      <UButton variant="ghost" color="black" @click="emit('handleSortingButton', props.sortKey)">
        {{ props.label }}
        <template #trailing>
          <UIcon 
            :name="props.sortIcon" 
            class="w-auto" 
          />
        </template>
      </UButton>
    </div>
  </template>
  <template v-else>
    <div class="py-1.5" style="white-space:nowrap;">
      {{ props.label }}
    </div>
  </template>
</template>