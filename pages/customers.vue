<script lang="ts" setup>
const toast = useToast()

useSeoMeta({
  title: 'Grimm-Customers'
})

const defaultColumns = [{
    key: 'number',
    label: 'Number',
    sortable: true,
  }, {
    key: 'fname',
    label: 'First',
    sortable: true
  }, {
    key: 'lname',
    label: 'Last',
    sortable: true
  }, 
  {
    key: 'company1',
    label: 'Company',
    sortable: true
  }, 
  {
    key: 'homephone',
    label: 'HomePhone',
    sortable: true
  }, 
  {
    key: 'workphone',
    label: 'WorkPhone',
    sortable: true
  }, 
  {
    key: 'state',
    label: 'State',
    sortable: true
  },
  {
    key: 'zip',
    label: 'Zip',
    sortable: true
  },
  {
    key: 'actions',
    label: 'Actions'
  }
]

const selectedColumns = ref(defaultColumns)
const sort = ref({ column: 'UniqueID', direction: 'asc' })
const input = ref<{ input: HTMLInputElement }>()
const isCustomerModalOpen = ref(false)
const modalTitle = ref("New Customer")
const modalDescription = ref("Add a new customer to your database")
const customers = ref([])
const selectedCustomer: any = ref(null)
const page = ref(1)
const pageSize = ref(50)
const numberOfCustomers = ref(0)
const sortButtons = ref({
  number: {direction: 'none', key: 'number'},
  fname: {direction: 'none', key: 'fname'},
  lname: {direction: 'none', key: 'lname'},
  company1: {direction: 'none', key: 'company1'},
  homephone: {direction: 'none', key: 'homephone'},
  workphone: {direction: 'none', key: 'workphone'},
  state: {direction: 'none', key: 'state'},
  zip: {direction: 'none', key: 'zip'}
})
const filters = ref({
  number: null,
  fname: null,
  lname: null,
  company1: null,
  homephone: null,
  workphone: null,
  state: null,
  zip: null
})
const pending = ref(false)
const exportPending = ref(false)

const ascIcon = "i-heroicons-bars-arrow-up-20-solid"
const descIcon = "i-heroicons-bars-arrow-down-20-solid"
const noneIcon = "i-heroicons-arrows-up-down-20-solid"

const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

const getCustomers = async (method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, params?: any, data?: any) => {
  pending.value = true
  // loadingOverlay.value = true
  const res = await customAxios({
    method: method, 
    url: url,
    params: {
      page: page.value,
      pageSize: pageSize.value, 
      sortBy: sort.value.column,
      sortOrder: sort.value.direction,
      ...filters.value,
      ...params
    },
    data: {
      ...data
    }
  })
  pending.value = false
  // loadingOverlay.value = false
  return res
}

const init = async () => {
  const { data } = await getCustomers('GET', '/api/customers')
  customers.value = data.body.list
  numberOfCustomers.value = data.body.numberOfCustomers | 0
}

const onCreate = () => {
  modalTitle.value = "New Customer";
  modalDescription.value = "Add a new customer to your database"
  selectedCustomer.value = null
  isCustomerModalOpen.value = true
}

const onEdit = (row) => {
  modalTitle.value = "Edit";
  modalDescription.value = "Edit customer information"
  selectedCustomer.value = row?.UniqueID
  isCustomerModalOpen.value = true
}

const onDelete = async (row: any) => {
  const res = await customAxios({
    method: 'DELETE', 
    url: `/api/customers/${row?.UniqueID}`
  })
  if (res.status === 200) {
    toast.add({
      title: "Success",
      description: res.data.message,
      icon: 'i-heroicons-trash-solid',
      color: 'green'
    })
    init()
  } else {
    toast.add({
      title: "Fail",
      description: res.data.error,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  }
}

const handleModalClose = () => {
  isCustomerModalOpen.value = false
}

const handleModalSave = async (data) => {
  if(selectedCustomer.value === null) { // Create Customer
    const res = await customAxios({
      method: 'POST',
      url: '/api/customers',
      data: data
    })
    if (res.status === 200) {
      toast.add({
        title: "Success",
        description: res.data.message,
        icon: 'i-heroicons-check-circle',
        color: 'green'
      })
      init()
    } else {
      toast.add({
        title: "Fail",
        description: res.data.error,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red'
      })
    }
  } else { // Update Customer
    // const res = await getCustomers('PUT', '/api/customers', { UniqueID: data?.UniqueID }, data)
    const res = await customAxios({
      method: 'PUT',
      url: `/api/customers/${selectedCustomer.value}`,
      data: data
    })
    if (res.status === 200) {
      toast.add({
        title: "Success",
        description: res.data.message,
        icon: 'i-heroicons-check-circle',
        color: 'green'
      })
      init()
    } else {
      toast.add({
        title: "Fail",
        description: res.data.error,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red'
      })
    }
  }
}

const handlePageChange = async () => {
  init()
}

const handleSortingButton = async (btnName: string) => {
  for(const [btn, btnProp] of Object.entries(sortButtons.value)) {
    if(btnName === btn) {
      switch(btnProp.direction) {
        case 'none':
          btnProp.direction = 'asc'
          sort.value.column = btnName
          sort.value.direction = 'asc'
          break
        case 'asc':
          btnProp.direction = 'desc'
          sort.value.column = btnName
          sort.value.direction = 'desc'
          break
        default:
          btnProp.direction = 'none'
          sort.value.column = 'UniqueID'
          sort.value.direction = 'asc'
          break
      } 
    } else {
      btnProp.direction = 'none'
    }
  }
  init()
}

const handleFilterInputChange = async (event, name) => {
  if (filters.value.hasOwnProperty(name)) {
    filters.value[name] = event;
  } else {
    console.error(`Filter does not have property: ${name}`);
  }
  init()
}

const excelExport = async () => {
  exportPending.value = true
  const params = {
      sortBy: sort.value.column,
      sortOrder: sort.value.direction,
      ...filters.value,
    }
  
  const paramsString = Object.entries(params)
    .map(([key, value]) => {
      if(value !== null)
        return `${key}=${value}`
    })
    .join("&") 
  location.href = `/api/customers/export?${paramsString}`
  exportPending.value = false
}

defineShortcuts({
  '/': () => {
    input.value?.input?.focus()
  }
})

init()
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        title="customers"
        :badge="numberOfCustomers | 0"
      >
        <template #right>
          <UButton 
            :loading="exportPending"
            label="Export to Excel" 
            color="gray"
            @click="excelExport"
          >
            <template #trailing>
              <UIcon name="i-heroicons-document-text" class="text-green-500 w-5 h-5" />
            </template>
          </UButton>
          <UButton
            label="New customer"
            color="gray"
            trailing-icon="i-heroicons-plus"
            @click="onCreate()"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #right>
          <USelectMenu
            v-model="selectedColumns"
            icon="i-heroicons-adjustments-horizontal-solid"
            :options="defaultColumns"
            multiple
            class="hidden lg:block"
          >
            <template #label>
              Display
            </template>
          </USelectMenu>
        </template>
      </UDashboardToolbar>
      
      <!-- New Modal -->
      <UDashboardModal
        v-model="isCustomerModalOpen"
        :title=modalTitle
        :description="modalDescription"
        :ui="{width: 'w-[1000px] sm:max-w-7xl'}"
      >
        <CustomersForm @close="handleModalClose" @save="handleModalSave" :selected-customer="selectedCustomer"/>
      </UDashboardModal>

      <!-- Old Modal -->
      <!-- <UDashboardModal
        v-model="isCustomerModalOpen"
        :title=modalTitle
        :description="modalDescription"
        :ui="{width: 'w-[1000px] sm:max-w-7xl', height: 'h-[680px] sm:h-[680px]'}"
      >
        <CustomersFormOld @close="handleModalClose" @save="handleModalSave" :selected-customer="selectedCustomer"/>
      </UDashboardModal> -->
      <UTable
        :rows="customers"
        :columns="columns"
        :loading="pending"
        class="w-full"
        :ui="{
          divide: 'divide-gray-200 dark:divide-gray-800', 
          th: { 
            base: 'sticky top-0 z-10',
            color: 'bg-white dark:text-gray dark:bg-[#111827]',
          }, 
          td: {
            padding: 'py-1'
          }
        }"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
      >
        <template #number-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton" 
            @handle-input-change="handleFilterInputChange"
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.number.direction === 'none' ? noneIcon : sortButtons.number.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
        <template #fname-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton" 
            @handle-input-change="handleFilterInputChange"
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.fname.direction === 'none' ? noneIcon : sortButtons.fname.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
        <template #lname-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton"
            @handle-input-change="handleFilterInputChange" 
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.lname.direction === 'none' ? noneIcon : sortButtons.lname.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
        <template #company1-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton" 
            @handle-input-change="handleFilterInputChange"
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.company1.direction === 'none' ? noneIcon : sortButtons.company1.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
        <template #homephone-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton" 
            @handle-input-change="handleFilterInputChange"
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.homephone.direction === 'none' ? noneIcon : sortButtons.homephone.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
        <template #workphone-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton" 
            @handle-input-change="handleFilterInputChange"
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.workphone.direction === 'none' ? noneIcon : sortButtons.workphone.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
        <template #state-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton" 
            @handle-input-change="handleFilterInputChange"
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.state.direction === 'none' ? noneIcon : sortButtons.state.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
        <template #zip-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton"
            @handle-input-change="handleFilterInputChange"
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.zip.direction === 'none' ? noneIcon : sortButtons.zip.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
        <template #actions-data="{row}">
          <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square-20-solid" @click="onEdit(row)"/>
          <UButton color="gray" variant="ghost" icon="i-heroicons-trash-20-solid" class="ml-2" @click="onDelete(row)"/>
        </template>
      </UTable>
        <!-- </div> -->
      <div class="flex flex-row justify-end mr-20">
        <UPagination :max="7" :page-count="pageSize" :total="numberOfCustomers | 0" v-model="page" @update:model-value="handlePageChange()"/>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
<style scoped>
</style>