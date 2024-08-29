<script setup lang="ts">
const emit = defineEmits(['handleSortingButton', 'handleSelectChange'])
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
    type: [String, null]
  },
  filterable: {
    type: [Boolean, null]
  }, 
  filterKey: {
    type: [String]
  }, 
  filterOptions: {
    type: [Array, null]
  }
})
</script>
<template>
  <template v-if="props.sortable">
    <div>
      <UButton variant="ghost" color="black" @click="emit('handleSortingButton', props.sortKey)">
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
    <div class="flex justify-center text-center px-[10px] py-[6px]">
      {{ props.label }}
    </div>
  </template>
  <template v-if="props.filterable">
    <div>
      <USelect
        :model-value="props.value"
        :options="props.filterOptions"
        @update:model-value="event => emit('handleSelectChange', event, props.filterKey)"
      />
    </div>
  </template>
</template>