<script setup lang="ts">
import Requisitions from "../../components/materials/requisitions/list.vue";
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardPanelContent class="p-0 bg-gms-gray-100">
        <Requisitions />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
