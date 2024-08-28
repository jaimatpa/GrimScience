<script lang="ts" setup>
  useSeoMeta({
    title: 'Grimm-Customers'
  })
  const selectedCustomer = ref(null)

  const handleSave = async () => {
    await useApiFetch('/api/customers/numbers', {
      method: 'GET',
      async onResponse({ response }) {
        if(response.status === 200) {
          let numberOfCustomers = response._data.body
          let pageSize = 50
          let page = Math.ceil(numberOfCustomers / pageSize)
          await navigateTo(`/customers/customers/list?page=${page}&pagesize=${pageSize}`)
        }
      }
    })
  }

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        title="Customers / Add new customer"
      >
      </UDashboardNavbar>
      <UDashboardPanelContent>
        <div class="p-6 overflow-x-auto">
          <CustomersForm @save="handleSave" :selected-customer="selectedCustomer"/>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
<style scoped>
</style>