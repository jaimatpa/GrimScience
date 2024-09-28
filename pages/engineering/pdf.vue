<template>
    <UDashboardPage>
      <UDashboardPanel grow>
        <UDashboardPanelContent>
          <ChangeOrderPage />
          <button @click="onPrevieOrderBtnClick">Preview Order</button>
          <PrintModal v-if="isModalOpen" @close="isModalOpen = false" />
        </UDashboardPanelContent>
      </UDashboardPanel>
    </UDashboardPage>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import ChangeOrderPage from "../../components/engineering/changeOrder/list.vue";

  const isModalOpen = ref(false);
  
  const onPrevieOrderBtnClick = () => { 
    isModalOpen.value = true; // Open the modal
  }
  </script>
  
  <style scoped>
  /* Add any necessary styles here */
  </style>