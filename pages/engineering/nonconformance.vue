<script lang="ts" setup>
useSeoMeta({
  title: 'Grimm-Engineering nonconformance'
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsBlueHeader" title="Non Conformance" />
        <EngineeringNonconformanceDetail />
    </UDashboardPanel>
  </UDashboardPage>
</template>
