<script lang="ts" setup>
useSeoMeta({
  title: 'Grimm-Engineering nonconformance'
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsBlueHeader" title="Non Conformance" />
      <div class="overflow-y-scroll">
        <EngineeringNonconformanceDetail />
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
