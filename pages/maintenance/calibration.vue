<script setup lang="ts">
import CalibrationPage from "../../components/maintenance/calibration/list.vue";
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardPanelContent class="p-0 bg-gms-gray-100">
        <CalibrationPage :is-page="true" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
