<script setup lang="ts">
import EquipmentPage from "../../components/maintenance/equipment/list.vue";
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardPanelContent class="p-0 bg-gree-400">
        <EquipmentPage />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
