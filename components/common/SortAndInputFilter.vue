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
  filterable: {
    type: [Boolean, null]
  }, 
  filterKey: {
    type: [String]
  }
})
</script>
<template>
  <template v-if="props.sortable">
    <div>
      <UButton variant="ghost" color="gray" @click="emit('handleSortingButton', props.sortKey)">
        {{ props.label }}
        <template #trailing>
          <UIcon 
            :name="props.sortIcon" 
            class="w-5 h-5" 
          />
        </template>
      </UButton>
    </div>
  </template>
  <template v-else>
    {{ props.label }}
  </template>
  <template v-if="props.filterable">
    <div>
      <UInput
        @update:model-value="event => emit('handleInputChange', event, props.filterKey)"
      />
    </div>
  </template>
</template>