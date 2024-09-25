<script lang="ts" setup>
  useSeoMeta({
    title: 'Grimm-Customers'
  })
  const toast= useToast()
  const route = useRoute()
  const selectedOrder = ref(null)
  selectedOrder.value = route.params.id
  const title = "Customers / " + route.params.id

  const handleClose = async () => {
    await navigateTo('/service/order');
  }
  const handleSave = async (data) => {
    if(selectedOrder.value === null) { // Create Customer
      await useApiFetch('/api/customers', {
        method: 'POST',
        body: data, 
        onResponse({ response }) {
          if(response.status === 200) {
            toast.add({
              title: "Success",
              description: response._data.message,
              icon: 'i-heroicons-check-circle',
              color: 'green'
            })
          }
        }
      })
    } else { // Update Customer
      await useApiFetch(`/api/customers/${selectedOrder.value}`, {
        method: 'PUT',
        body: data, 
        onResponse({ response }) {
          if (response.status === 200) {

            toast.add({
              title: "Success",
              description: response._data.message,
              icon: 'i-heroicons-check-circle',
              color: 'green'
            })
          }
        }
      })
    }
  }
  
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        :title = title
      >
      </UDashboardNavbar>
      <UDashboardPanelContent>
        <div class="p-6 overflow-x-auto">
          <!-- <ServiceOrderDetail @close="handleClose" :form-action ="null" @save="handleSave" :selected-order="selectedOrder"/> -->
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
<style scoped>
</style>