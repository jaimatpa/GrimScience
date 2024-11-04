<script lang="ts" setup>

useSeoMeta({
  title: 'Grimm-Utilities rates'
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>

      <UDashboardNavbar class="gmsRedHeader" title="Shipping Rates">
      </UDashboardNavbar>
       <UDashboardPanelContent class="p-0">
        <UtilitiesShippingRates />
      </UDashboardPanelContent>

    </UDashboardPanel>
  </UDashboardPage>
</template>