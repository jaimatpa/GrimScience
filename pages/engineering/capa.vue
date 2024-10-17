<script lang="ts" setup>
useSeoMeta({
  title: 'Grimm-Engineering capa'
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow class="overflow-y-auto">
      <EngineeringCapaDetail :selected-capa="null" />
    </UDashboardPanel>
  </UDashboardPage>
</template>