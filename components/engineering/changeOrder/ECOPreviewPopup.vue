<!-- components/engineering/changeOrder/ECOPreviewPopup.vue -->
<template>
  <dialog v-if="isPopupVisible" class="popup-modal">
    <div class="popup-content">
      <h2>Preview ECO</h2>
      <p>Here is the content for the ECO preview.</p>

      <!-- Close button -->
      <UButton color="red" label="Close" @click="closePopup" />
    </div>
  </dialog>
</template>

<script setup>
import { ref } from 'vue'

// Define popup visibility state
const isPopupVisible = ref(false)

// Function to open the popup
const openPopup = () => {
  isPopupVisible.value = true
}

// Function to close the popup
const closePopup = () => {
  isPopupVisible.value = false
}

// Expose methods to the parent
defineExpose({ openPopup, closePopup })
</script>

<style scoped>
.popup-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: white;
  border: 1px solid #ccc;
  padding: 20px;
  z-index: 1000;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.popup-content {
  text-align: center;
}
</style>