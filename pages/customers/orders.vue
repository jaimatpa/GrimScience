<script lang="ts" setup>
  useSeoMeta({
    title: 'Grimm-Customers Orders'
  })

  const defaultColumns = [{
      key: 'UniqueID',
      label: 'SO#',
      sortable: true,
    }, {
      key: 'serialid',
      label: 'Serial#',
      sortable: true
    }, {
      key: 'orderdate',
      label: 'Date',
      sortable: true
    }, 
    {
      key: 'failure',
      label: 'Failure Comment',
      sortable: true
    }, 
    {
      key: 'company',
      label: 'Company',
      sortable: true
    }, 
    {
      key: 'status',
      label: 'Status',
    }, 
    {
      key: 'injury',
      label: 'Injury',
    },
    {
      key: 'warranty',
      label: 'Warranty',
    },
    {
      key: 'complaint',
      label: 'Complaint'
    }
  ]
  const ascIcon = "i-heroicons-bars-arrow-up-20-solid"
  const descIcon = "i-heroicons-bars-arrow-down-20-solid"
  const noneIcon = "i-heroicons-arrows-up-down-20-solid"

  const filters = ref({
    productLine: null,
    UniqueID: null,
    serial: null,
    orderdate: null,
    failureComment: null,
    company: null,
    status: null,
    injury: null,
    warranty: null,
    complaint: null,
  });
  const sortButtons = ref({
    UniqueID: {direction: 'none', key: 'number'},
    serialid: {direction: 'none', key: 'fname'},
    orderdate: {direction: 'none', key: 'lname'},
    failure: {direction: 'none', key: 'company1'},
    company: {direction: 'none', key: 'homephone'},
    status: {direction: 'none', key: 'workphone'},
    injury: {direction: 'none', key: 'workphone'},
    warranty: {direction: 'none', key: 'state'},
    complaint: {direction: 'none', key: 'zip'}
  })
  const checkboxes = ref({
    open: true,
    cryotherm: false,
    nonMedical: false,
    complaints: false,
    injury: false
  })
  const sort = ref({ column: 'UniqueID', direction: 'asc' })
  const orders = ref([])
  const page = ref(1)
  const pageSize = ref(50)
  const productLines = ref([]);
  const totalBuilt = ref(24570);
  const totalOrders = ref(233);
  const percent = ref(1)
  const pending = ref(false)
  const exportPending = ref(false)
  const isCustomersOrderModalOpen = ref(false)
  const selectedOrder = ref(null)

  const init = () => {
    pending.value = true
    useApiFetch('/api/customers/orders', {
      method: 'GET',
      params: {
        page: page.value,
        pageSize: pageSize.value,
        sortBy: sort.value.column,
        sortOrder: sort.value.direction,
        ...filters.value
      }, 
      onResponse({ response }) {
        if(response.status === 200) {
          pending.value = false
          orders.value = response._data.body;
        }
      }
    })
  }
  
  const handleFilterChange = () => {
    init()
  }
  const handleSortingButton = (btnName: string) => {
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
    page.value = 1
    if (filters.value.hasOwnProperty(name)) {
      filters.value[name] = event;
    }
    init()
  }
  const handlePageChange = () => {
    init()
  }
  const handleTableRowSelect = (row) => {
    isCustomersOrderModalOpen.value = true
  }
  const handleModalClose = () => {
    isCustomersOrderModalOpen.value = false
  }
  const handleModalSave = () => {
  
  }
  const excelExport = () => {

  }

  init()
</script>

<template>
    <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        title="Customer Service Order List"
      >
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <div class="flex flex-row space-x-3">
            <div class="basis-1/5 max-w-[300px] min-w-[150px] mr-4">
              <UFormGroup
                label="Product Line"
                name="productLine"
              >
                <USelect
                  v-model="filters.productLine"
                  :options="productLines"
                  @change="handleFilterChange()"
                />
              </UFormGroup>
            </div>
            <div class="basis-1/5 max-w-[300px] min-w-[150px]">
              <UFormGroup
                label="Total Built"
                name="totalBuilt"
              >
                <div class="text-bold">
                  {{ totalBuilt }}
                </div>
              </UFormGroup>
            </div>
            <div class="basis-1/5 max-w-[300px] min-w-[150px]">
              <UFormGroup
                label="Total Orders"
                name="totalOrders"
              >
                <div class="text-bold">
                  {{ totalOrders }}
                </div>
              </UFormGroup>
            </div>
            <div class="basis-1/5 max-w-[300px] min-w-[150px]">
              <UFormGroup
                label="%"
                name="percent"
              >
                <div class="text-bold">
                  {{ percent }}%
                </div>
              </UFormGroup>
            </div>
          </div>
        </template>
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
        </template>
      </UDashboardToolbar>
      
      <UDashboardModal
        v-model="isCustomersOrderModalOpen"
        title="Service Order List"
        description="Service Order List"
        :ui="{width: 'w-[1000px] sm:max-w-7xl', height: 'h-[680px] sm:h-[680px]'}"
      >
        <CustomersOrder @close="handleModalClose" @save="handleModalSave" :selected-customer="selectedOrder"/>
      </UDashboardModal>



      <div class="flex flex-row px-10 mt-4">
        <div class="basis-1/5">
          <UCheckbox
            v-model="checkboxes.open"
            label="Open"
          />
        </div>
        <div class="basis-1/5">
          <UCheckbox
            v-model="checkboxes.cryotherm"
            label="CRYOTherm Checkup"
          />
        </div>
        <div class="basis-1/5">
          <UCheckbox
            v-model="checkboxes.nonMedical"
            label="Non-Medical Device"
          />
        </div>
        <div class="basis-1/5">
          <UCheckbox
            v-model="checkboxes.complaints"
            label="Complaints"
          />
        </div>
        <div class="basis-1/5">
          <UCheckbox
            v-model="checkboxes.injury"
            label="Injury Reports"
          />
        </div>
      </div>
      <UTable
        :rows="orders"
        :columns="defaultColumns"
        :loading="pending"
        class="w-full"
        :ui="{
          divide: 'divide-gray-200 dark:divide-gray-800', 
          th: { 
            base: 'sticky top-0 z-10',
            color: 'bg-white dark:text-gray dark:bg-[#111827]',
          }, 
          td: {
            padding: 'py-2'
          }
        }"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }"
        @select="handleTableRowSelect"
      >
        <template #UniqueID-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton" 
            @handle-input-change="handleFilterInputChange"
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.UniqueID.direction === 'none' ? noneIcon : sortButtons.UniqueID.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
        <template #serialid-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton" 
            @handle-input-change="handleFilterInputChange"
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.serialid.direction === 'none' ? noneIcon : sortButtons.serialid.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
        <template #orderdate-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton" 
            @handle-input-change="handleFilterInputChange"
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.orderdate.direction === 'none' ? noneIcon : sortButtons.orderdate.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
        <template #failure-header="{ column }">
          <div class="min-w-[200px]">
            <CustomersSortAndFilter 
              @handle-sorting-button="handleSortingButton" 
              @handle-input-change="handleFilterInputChange"
              :sort-key="column.key" 
              :sort-label="column.label" 
              :sort-icon="sortButtons.failure.direction === 'none' ? noneIcon : sortButtons.failure.direction === 'asc' ? ascIcon : descIcon"
              :filter-key="column.key"
            />
          </div>
        </template>
        <template #company-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton" 
            @handle-input-change="handleFilterInputChange"
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.company.direction === 'none' ? noneIcon : sortButtons.company.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
        <template #status-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton" 
            @handle-input-change="handleFilterInputChange"
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.status.direction === 'none' ? noneIcon : sortButtons.status.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
        <template #injury-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton" 
            @handle-input-change="handleFilterInputChange"
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.injury.direction === 'none' ? noneIcon : sortButtons.injury.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
        <template #warranty-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton" 
            @handle-input-change="handleFilterInputChange"
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.warranty.direction === 'none' ? noneIcon : sortButtons.warranty.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
        <template #complaint-header="{ column }">
          <CustomersSortAndFilter 
            @handle-sorting-button="handleSortingButton" 
            @handle-input-change="handleFilterInputChange"
            :sort-key="column.key" 
            :sort-label="column.label" 
            :sort-icon="sortButtons.complaint.direction === 'none' ? noneIcon : sortButtons.complaint.direction === 'asc' ? ascIcon : descIcon"
            :filter-key="column.key"
          />
        </template>
      </UTable>
      <div class="border-t-[1px] border-gray-200 mb-1 dark:border-gray-800">
        <div class="flex flex-row justify-end mr-20 mt-1" >
          <UPagination :max="7" :page-count="pageSize" :total="1000" v-model="page" @update:model-value="handlePageChange()"/>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>