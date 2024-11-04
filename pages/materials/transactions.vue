<script lang="ts" setup>
useSeoMeta({
  title: 'Grimm-Materials transactions'
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <MaterialsTransactionsInventoryTransactions :is-page="true" />
    </UDashboardPanel>
  </UDashboardPage>
</template>