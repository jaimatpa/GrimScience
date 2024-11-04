<script setup lang="ts">
import SettingsPage from "../../components/utilities/Settings/Settings.vue";
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardPanelContent class="p-0 bg-gms-gray-100">
        <SettingsPage />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
