<script lang="ts" setup>
  useSeoMeta({
    title: 'Grimm-Customers'
  })
  const route = useRoute()
  const selectedCustomer = ref(null)
  selectedCustomer.value = route.params.id
  const title = ref("Customer")
  const init = () => {
    useApiFetch(`/api/customers/${selectedCustomer.value}`, {
      method: 'GET',
      onResponse({ response }) {
        if(response.status === 200) {
          const fullName = response._data.body.fname + ' ' + response._data.body.lname;
          title.value = "Customer - " + fullName;
        }
      }
    })
  }
  onBeforeMount(() => {
    init()
  })
  const handleSave = () => {
    init()
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
          <MaterialsSerialsForm @save="handleSave" :selected-customer="selectedCustomer" />
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
<style scoped>
</style>