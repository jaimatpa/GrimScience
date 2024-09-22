<script lang="ts" setup>
import PurchaseDetails from '~/components/materials/vendors/PurchaseDetails.vue';

useSeoMeta({
  title: 'Grimm-Materials purchases'
})
const loadingOverlay = ref(false)

const formState = ref({
  searchItems: 150,
  showOpen: true
})
const selectedRow = ref({});

const columns = ref([
  {
    key: 'PONUMBER',
    label: 'PO Number',
    sortable: false,
    filterable: false,
  },
  {
    key: 'DATE',
    label: 'Date',
    sortable: false,
    filterable: false,
  },
  {
    key: 'NAME',
    label: 'Vendor',
    sortable: false,
    filterable: false,
  },
  {
    key: 'TOTAL',
    label: 'Total',
    sortable: false,
    filterable: false,
  },
  {
    key: 'details',
    label: 'Details',
    kind: 'actions',
    class: 'text-center'
  },
]);
const onPODetails = (row) => {
  selectedRow.value = row;
  showPODetailsModal.value = true;
};

const modalUIConfig = {
  title: 'text-lg',
  header: { base: 'flex flex-row min-h-[0] items-center', padding: 'pt-5 sm:px-9' },
  body: { base: 'gap-y-1', padding: 'sm:pt-0 sm:px-9 sm:py-3 sm:pb-5' },
  width: 'w-[1800px] sm:max-w-9xl',
};

const tableUIConfig = {
  divide: 'divide-gray-200 dark:divide-gray-800',
  th: {
    base: 'sticky top-0 z-10',
    color: 'bg-white dark:text-gray dark:bg-[#111827]',
    padding: 'p-2',
  },
  td: {
    padding: 'p-2',
  }
};
const rows = ref([
  { po: '13082', date: '8/30/2024', vendor: 'ACCO', phone: '(800) 222-6462', total: 71.52, open: true },
  { po: '13081', date: '8/30/2024', vendor: 'Blue Monster Products', phone: '(800) 321-3598', total: 45.72, open: false },
  // ... add more rows as needed
])

const dateRange = ref({
  from: '2024-09-08',
  to: '2024-09-15'
})

const filters = ref({
  search: '',
  vendor: null,
  status: null
})

const vendorOptions = computed(() => {
  return [...new Set(rows.value.map(row => row.vendor))].map(vendor => ({ label: vendor, value: vendor }))
})

const statusOptions = [
  { label: 'Open', value: true },
  { label: 'Closed', value: false }
]

const filteredRows = computed(() => {
  return rows.value.filter(row => {
    const searchMatch = Object.values(row).some(value =>
      String(value).toLowerCase().includes(filters.value.search.toLowerCase())
    )
    const vendorMatch = !filters.value.vendor || row.vendor === filters.value.vendor
    const statusMatch = filters.value.status === null || row.open === filters.value.status
    return searchMatch && vendorMatch && statusMatch
  })
})

const totalPurchases = computed(() => {
  return filteredRows.value.reduce((sum, row) => sum + row.total, 0)
})

const totalOpenOrders = computed(() => {
  return filteredRows.value.filter(row => row.open).reduce((sum, row) => sum + row.total, 0)
})

function viewPurchaseOrder(row) {
  // Implement view functionality
  console.log('Viewing purchase order:', row)
}

function deletePurchaseOrder(row) {
  console.log('Deleting purchase order:', row)
}

function lookupDateRange() {
  console.log('Looking up date range:', dateRange.value)
}
</script>
<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar class="gmsBlueHeader" title="Vendors" />

      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <UFormGroup label="Number of Search Items to Return" labelClass="mr-2">
                <UInput v-model="formState.searchItems" type="number" class="w-24" />
              </UFormGroup>
              <UCheckbox v-model="formState.showOpen" label="Show Open" />
            </div>
            <div class="flex justify-between items-center">
              <UFormGroup label="Date Range" labelClass="mr-2">
                <div class="flex space-x-2">
                  <UInput v-model="dateRange.from" type="date" />
                  <span class="self-center">to</span>
                  <UInput v-model="dateRange.to" type="date" />
                  <UButton icon="i-heroicons-magnifying-glass" color="primary" @click="lookupDateRange"></UButton>
                </div>
              </UFormGroup>
            </div>
          </div>
        </template>

        <div class="mb-4 flex space-x-4">
          <UInput v-model="filters.search" icon="i-heroicons-magnifying-glass" placeholder="Search..."
            class="flex-grow" />
          <USelect v-model="filters.vendor" :options="vendorOptions" placeholder="Select Vendor" />
          <USelect v-model="filters.status" :options="statusOptions" placeholder="Select Status" />
        </div>

        <UTable :rows="rows" :columns="columns" :loading="loadingOverlay" class="w-full" :ui="tableUIConfig"
          :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }">
          <template #actions-data="{ row }">
            <UTooltip text="Parts Supplied Details" class="flex justify-center">
              <UButton color="gray" variant="ghost" icon="i-heroicons-eye" @click="onPODetails(row)" />
            </UTooltip>
            <UTooltip text="Delete Purchase Order">
              <UButton color="red" variant="ghost" icon="i-heroicons-trash" @click="deletePurchaseOrder(row)" />
            </UTooltip>
          </template>
        </UTable>
        <template #footer>

          <div class="mt-4 grid grid-cols-2 gap-4">
            <UCard>
              <template #header>Total Purchases on Search</template>
              <p class="text-2xl font-bold">${{ totalPurchases.toFixed(2) }}</p>
            </UCard>
            <UCard>
              <template #header>Total Amount of Open Orders</template>
              <p class="text-2xl font-bold">${{ totalOpenOrders.toFixed(2) }}</p>
            </UCard>
          </div>
        </template>
      </UCard>
    </UDashboardPanel>
  </UDashboardPage>

  <UDashboardModal v-model="showPODetailsModal" title="PO Details" :ui="modalUIConfig">
    <PurchaseDetails :is-creating="false" :modal-data="selectedRow"></PurchaseDetails>
  </UDashboardModal>

</template>