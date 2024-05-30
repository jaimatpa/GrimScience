<script setup lang="ts">
  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    selectItems: {
      type: Array as () => any,
      required: true
    }, 
    icon: {
      type: String,
      required: true
    }
  })
</script>

<template>
  <UDropdown
    :items="props.selectItems" 
    :popper="{ offsetDistance: 0, placement: 'right-start' }"
    :ui="{
      wrapper: 'w-full'
    }"
  >
    <UButton 
      color="white" 
      :label="props.label" 
      :ui="{
        base: 'w-full'
      }" 
    >
      <template #leading>
        <UIcon 
          :name="props.icon" 
          class="w-5 h-5"
        />
      </template>
      <template #trailing>
        <UIcon name="i-heroicons-chevron-down-20-solid" />
      </template>

    </UButton>
  </UDropdown>
</template>